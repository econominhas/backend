import { DayjsAdapterService } from "../../../src/adapters/implementations/dayjs/dayjs.service";
import { type Mock } from "../types";
import { type DateAdapter } from "../../../src/adapters/date";

export const makeDayjsAdapterMock = () => {
	const mock: Mock<DateAdapter> = {
		today: jest.fn(),
		newDate: jest.fn(),
		get: jest.fn(),
		diff: jest.fn(),
		getDayOfWeek: jest.fn(),
		getNextMonths: jest.fn(),
		format: jest.fn(),
		statementDate: jest.fn(),
		dueDate: jest.fn(),
		isSameMonth: jest.fn(),
		isAfterToday: jest.fn(),
		nowPlus: jest.fn(),
		setDay: jest.fn(),
		add: jest.fn(),
		sub: jest.fn(),
		startOf: jest.fn(),
		endOf: jest.fn(),
	};

	const module = {
		provide: DayjsAdapterService,
		useValue: mock,
	};

	return {
		mock,
		module,
	};
};
