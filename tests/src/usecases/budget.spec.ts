import { type INestApplication } from "@nestjs/common";

import { BudgetService } from "../../../src/usecases/budget/budget.service";
import { BudgetModule } from "../../../src/usecases/budget/budget.module";
import { createTestModule, createTestService } from "../../utils";
import { makeBudgetRepositoryMock } from "../../mocks/repositories/postgres/budget";
import { makeCategoryRepositoryMock } from "../../mocks/repositories/postgres/category";
import { makeTransactionRepositoryMock } from "../../mocks/repositories/postgres/transaction";
import { makeAccountServiceMock } from "../../mocks/usecases/account";
import { makeDayjsAdapterMock } from "../../mocks/adapters/dayjs";

describe("Usecases > Budget", () => {
	let service: BudgetService;
	let module: INestApplication;

	const budgetRepository = makeBudgetRepositoryMock();
	const categoryRepository = makeCategoryRepositoryMock();
	const transactionRepository = makeTransactionRepositoryMock();
	const accountService = makeAccountServiceMock();
	const dayjsAdapter = makeDayjsAdapterMock();

	const baseSuccessResult = {
		name: "Test Budget",
		description: "Test Budget Description",
	};

	beforeAll(async () => {
		service = await createTestService<BudgetService>(BudgetService, {
			providers: [
				budgetRepository.module,
				categoryRepository.module,
				transactionRepository.module,
				accountService.module,
				dayjsAdapter.module,
			],
		});

		module = await createTestModule(BudgetModule);
	});

	beforeEach(() => {
		budgetRepository.mock.createWithItems.mockResolvedValue(
			budgetRepository.outputs.createWithItems.sucess,
		);
		accountService.mock.setBudget.mockResolvedValue(
			accountService.outputs.setBudget.sucess,
		);
		categoryRepository.mock.getByUser.mockResolvedValue(
			categoryRepository.outputs.getByUser.activeCategory,
		);
		budgetRepository.mock.getMonthlyByCategory.mockResolvedValue(
			budgetRepository.outputs.getMonthlyByCategory.positiveBudget,
		);
		transactionRepository.mock.getMonthlyAmountByCategory.mockResolvedValue(
			transactionRepository.outputs.getMonthlyAmountByCategory.expensePositive,
		);
		dayjsAdapter.mock.startOf.mockReturnValue(2);
	});

	describe("definitions", () => {
		it("should initialize Service", () => {
			expect(service).toBeDefined();
		});

		it("should initialize Module", () => {
			expect(module).toBeDefined();
		});
	});

	describe("create", () => {
		it("should create a budget successfully", async () => {
			const input = {
				accountId: "accountId",
				name: "name",
				description: "description",
				year: 2024,
				months: [
					{ month: 1, items: [] },
					{ month: 2, items: [] },
				],
			};
			let result;
			try {
				result = await service.create(input);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({
				...baseSuccessResult,
				accountId: "accountId",
				id: "1",
			});
			expect(accountService.mock.setBudget).toHaveBeenCalled();
			expect(accountService.mock.setBudget).toHaveBeenCalledWith({
				accountId: "accountId",
				budgetId: "1",
			});
			expect(budgetRepository.mock.createWithItems).toHaveBeenCalledWith({
				accountId: "accountId",
				name: "name",
				description: "description",
				months: [
					{
						items: [],
						month: 1,
						year: 2024,
					},
					{
						items: [],
						month: 2,
						year: 2024,
					},
				],
			});
		});

		it("should throw an exception if creating budget fails", async () => {
			const input = {
				accountId: "1",
				name: "name",
				description: "description",
				year: 2024,
				months: [
					{ month: 1, items: [] },
					{ month: 2, items: [] },
				],
			};

			budgetRepository.mock.createWithItems.mockRejectedValue(
				new Error("Failed to create budget"),
			);

			let result;
			try {
				result = await service.create(input);
			} catch (err) {
				result = err;
			}

			expect(result).toBeInstanceOf(Error);
			expect(accountService.mock.setBudget).not.toHaveBeenCalled();
			expect(budgetRepository.mock.createWithItems).toHaveBeenCalledTimes(1);
		});

		it("should create a budget with the maximum number of months", async () => {
			const input = {
				...baseSuccessResult,
				accountId: "accountId",
				year: 2024,
				months: Array.from({ length: 12 }, (_, index) => ({
					month: index + 1,
					items: [],
				})),
			};

			let result;
			try {
				result = await service.create(input);
			} catch (err) {
				result = err;
			}

			expect(result).toBeDefined();
			expect(budgetRepository.mock.createWithItems).toHaveBeenCalledWith({
				...baseSuccessResult,
				accountId: "accountId",
				months: input.months.map(({ month, items }) => ({
					month,
					year: input.year,
					items,
				})),
			});
		});
	});

	describe("getOrCreateMany", () => {
		it("should creates new budget dates", async () => {
			const input = {
				budgetId: "1",
				accountId: "1",
				dates: [new Date(2024, 2, 1)],
			};

			dayjsAdapter.mock.get.mockReturnValueOnce(2).mockReturnValueOnce(2024);
			budgetRepository.mock.upsertManyBudgetDates.mockResolvedValue([
				{
					id: "1",
					budgetId: "1",
					month: 1,
					year: 2024,
					date: new Date(2024, 1, 24),
				},
			]);

			let result;
			try {
				result = await service.getOrCreateMany(input);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual([
				{
					id: "1",
					budgetId: "1",
					month: 1,
					year: 2024,
					date: new Date(2024, 1, 24),
				},
			]);
			expect(budgetRepository.mock.upsertManyBudgetDates).toHaveBeenCalledWith([
				{
					budgetId: "1",
					month: 2,
					year: 2024,
					date: 2,
				},
			]);
		});
	});

	describe("createBasic", () => {
		it("should creates new budget basic with items", async () => {
			const input = {
				description: baseSuccessResult.description,
				accountId: "accountId",
				name: "string",
				year: 2024,
				items: [
					{ categoryId: "1", amount: 100 },
					{ categoryId: "2", amount: 100 },
				],
			};

			let result;
			try {
				result = await service.createBasic(input);
			} catch (err) {
				result = err;
			}

			expect(result).toStrictEqual({
				id: "1",
				accountId: "accountId",
				...baseSuccessResult,
			});
			expect(accountService.mock.setBudget).toHaveBeenCalled();
			expect(accountService.mock.setBudget).toHaveBeenCalledWith({
				accountId: input.accountId,
				budgetId: budgetRepository.outputs.createWithItems.sucess.id,
			});
			expect(budgetRepository.mock.createWithItems).toHaveBeenCalledWith({
				accountId: "accountId",
				name: "string",
				description: baseSuccessResult.description,
				months: input.items
					.map(({ categoryId, amount }) =>
						Array(12)
							.fill(null)
							.map((_, idx) => ({
								month: idx + 1,
								year: input.year,
								items: [
									{
										categoryId,
										amount,
									},
								],
							})),
					)
					.flat(),
			});
		});
	});

	describe("overview", () => {
		it("should correctly handle active categories with expenses", async () => {
			const input = {
				accountId: "accountId",
				budgetId: "1",
				month: 2,
				year: 2024,
			};

			let result;
			try {
				result = await service.overview(input);
			} catch (err) {
				result = err;
			}

			expect(categoryRepository.mock.getByUser).toHaveBeenCalledWith({
				accountId: input.accountId,
				limit: 10000,
				offset: 0,
			});
			expect(budgetRepository.mock.getMonthlyByCategory).toHaveBeenCalledWith(
				input,
			);
			expect(
				transactionRepository.mock.getMonthlyAmountByCategory,
			).toHaveBeenCalledWith(input);

			expect(result).toMatchObject({
				totalBudget: 450,
				totalExpenses: 150,
				remainingBudget: 300,
			});
			expect(result.budgetByCategory).toStrictEqual([
				{
					id: 1,
					name: "Category A",
					active: true,
					totalExpenses: 50,
					totalBudget: 100,
					remainingBudget: 50,
					color: "red",
					description: "description",
					icon: "bank",
				},
				{
					id: 2,
					name: "Category B",
					active: true,
					totalExpenses: 0,
					totalBudget: 200,
					remainingBudget: 200,
					color: "red",
					description: "description",
					icon: "bank",
				},
				{
					id: 3,
					name: "Category C",
					active: true,
					totalExpenses: 100,
					totalBudget: 150,
					remainingBudget: 50,
					color: "red",
					description: "description",
					icon: "bank",
				},
			]);
		});

		it("should correctly handle inactive categories with expenses", async () => {
			const input = {
				accountId: "accountId",
				budgetId: "1",
				month: 2,
				year: 2024,
			};

			categoryRepository.mock.getByUser.mockResolvedValue(
				categoryRepository.outputs.getByUser.inactiveCategory,
			);

			let result;
			try {
				result = await service.overview(input);
			} catch (err) {
				result = err;
			}

			expect(categoryRepository.mock.getByUser).toHaveBeenCalledWith({
				accountId: input.accountId,
				limit: 10000,
				offset: 0,
			});
			expect(budgetRepository.mock.getMonthlyByCategory).toHaveBeenCalledWith(
				input,
			);
			expect(
				transactionRepository.mock.getMonthlyAmountByCategory,
			).toHaveBeenCalledWith(input);

			expect(result.budgetByCategory).toHaveLength(2);
			expect(result).toMatchObject({
				totalBudget: 450,
				totalExpenses: 150,
				remainingBudget: 300,
			});
			expect(result.budgetByCategory).toStrictEqual([
				{
					id: 1,
					name: "Category A",
					active: false,
					totalExpenses: 50,
					totalBudget: 100,
					remainingBudget: 50,
					color: "red",
					description: "description",
					icon: "bank",
				},
				{
					id: 3,
					name: "Category C",
					active: false,
					totalExpenses: 100,
					totalBudget: 150,
					remainingBudget: 50,
					color: "red",
					description: "description",
					icon: "bank",
				},
			]);
		});

		it("should correctly handle negative budgets and expenses", async () => {
			const input = {
				accountId: "accountId",
				budgetId: "1",
				month: 2,
				year: 2024,
			};

			budgetRepository.mock.getMonthlyByCategory.mockResolvedValue(
				budgetRepository.outputs.getMonthlyByCategory.negativeBudget,
			);
			transactionRepository.mock.getMonthlyAmountByCategory.mockResolvedValue(
				transactionRepository.outputs.getMonthlyAmountByCategory
					.expenseNegative,
			);

			let result;
			try {
				result = await service.overview(input);
			} catch (err) {
				result = err;
			}

			expect(categoryRepository.mock.getByUser).toHaveBeenCalledWith({
				accountId: input.accountId,
				limit: 10000,
				offset: 0,
			});
			expect(budgetRepository.mock.getMonthlyByCategory).toHaveBeenCalledWith(
				input,
			);
			expect(
				transactionRepository.mock.getMonthlyAmountByCategory,
			).toHaveBeenCalledWith(input);

			expect(result).toMatchObject({
				totalBudget: 120,
				totalExpenses: 250,
				remainingBudget: -130,
			});
			expect(result.budgetByCategory).toHaveLength(3);
			expect(result.budgetByCategory).toStrictEqual([
				{
					active: true,
					color: "red",
					description: "description",
					icon: "bank",
					id: 1,
					name: "Category A",
					remainingBudget: -150,
					totalBudget: -50,
					totalExpenses: 100,
				},
				{
					active: true,
					color: "red",
					description: "description",
					icon: "bank",
					id: 2,
					name: "Category B",
					remainingBudget: 70,
					totalBudget: 20,
					totalExpenses: -50,
				},
				{
					active: true,
					color: "red",
					description: "description",
					icon: "bank",
					id: 3,
					name: "Category C",
					remainingBudget: -50,
					totalBudget: 150,
					totalExpenses: 200,
				},
			]);
		});
	});

	describe("> createNextBudgetDates", () => {
		it("should generates future budget dates for a specific budget", async () => {
			const input = {
				startFrom: {
					id: "1",
					budgetId: "1",
					month: 2,
					year: 2024,
					date: new Date(2024, 3, 2),
				},
				amount: 14,
			};
			const dates = [
				new Date(2024, 3, 2),
				new Date(2024, 4, 2),
				new Date(2024, 5, 2),
				new Date(2024, 6, 2),
				new Date(2024, 7, 2),
				new Date(2024, 8, 2),
				new Date(2024, 9, 2),
				new Date(2024, 10, 2),
				new Date(2024, 11, 2),
				new Date(2025, 0, 2),
				new Date(2025, 1, 2),
				new Date(2025, 2, 2),
				new Date(2025, 3, 2),
				new Date(2025, 4, 2),
			];

			dayjsAdapter.mock.getNextMonths.mockReturnValue(dates);
			for (let index = 0; index < input.amount; index++) {
				dayjsAdapter.mock.get
					.mockReturnValueOnce(dates[index].getMonth() + 1)
					.mockReturnValueOnce(dates[index].getFullYear());
			}
			budgetRepository.mock.upsertManyBudgetDates.mockResolvedValue([
				{
					id: "1",
					budgetId: "1",
					month: 1,
					year: 2024,
					date: new Date(2024, 1, 24),
				},
			]);

			let result;
			try {
				result = await service.createNextBudgetDates(input);
			} catch (err) {
				result = err;
			}

			expect(
				budgetRepository.mock.upsertManyBudgetDates.mock.calls[0][0].slice(
					-1,
				)[0],
			).toStrictEqual({
				budgetId: "1",
				date: dates[input.amount - 1],
				month: 5,
				year: 2025,
			});
			expect(
				budgetRepository.mock.upsertManyBudgetDates.mock.calls[0][0],
			).toHaveLength(14);
			expect(result).toMatchObject([
				{
					budgetId: "1",
					date: new Date(2024, 1, 24),
					id: "1",
					month: 1,
					year: 2024,
				},
			]);
		});
	});
});
