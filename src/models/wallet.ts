/**
 *
 *
 * This module only serves as a centralizer for
 * bank accounts and cards, it should not have
 * any repository (at least for now)
 *
 *
 */

/**
 *
 *
 * Usecase
 *
 *
 */

export interface BalanceOverviewInput {
	accountId: string;
}

export interface BalanceOverviewOutput {
	bankAccountBalance: number;
	vaBalance?: number;
	vtBalance?: number;
}

export abstract class WalletUseCase {
	abstract balanceOverview(
		i: BalanceOverviewInput,
	): Promise<BalanceOverviewOutput>;
}
