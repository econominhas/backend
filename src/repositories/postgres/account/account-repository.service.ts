import { Injectable } from '@nestjs/common';
import {
	AccountEntity,
	AccountRepository,
	CreateInput,
	GetByIdInput,
	GetManyByProviderInput,
	GetByEmailInput,
	GetByProviderInput,
	GetByPhoneInput,
} from 'src/models/account';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { FilterQuery } from '@mikro-orm/core';

@Injectable()
export class AccountRepositoryService implements AccountRepository {
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountRepository: EntityRepository<AccountEntity>,
		private readonly idAdapter: UIDAdapter,
	) {}

	async create(i: CreateInput): Promise<AccountEntity> {
		const accountId = this.idAdapter.gen();

		return this.accountRepository.create({
			...i,
			id: accountId,
		});
	}

	async getById({ id }: GetByIdInput): Promise<undefined | AccountEntity> {
		return this.accountRepository.findOne({
			id,
		});
	}

	async getByEmail({
		email,
	}: GetByEmailInput): Promise<undefined | AccountEntity> {
		return this.accountRepository.findOne({
			email,
		});
	}

	async getByPhone({
		phone,
	}: GetByPhoneInput): Promise<undefined | AccountEntity> {
		return this.accountRepository.findOne({
			phone,
		});
	}

	async getByProvider({
		provider,
		providerId,
	}: GetByProviderInput): Promise<undefined | AccountEntity> {
		return this.accountRepository.findOne({
			signInProviders: [
				{
					provider,
					providerId,
				},
			],
		});
	}

	async getManyByProvider({
		provider,
		providerId,
		email,
	}: GetManyByProviderInput): Promise<Array<AccountEntity>> {
		const conditions = [
			{
				signInProviders: [
					{
						provider,
						providerId,
					},
				],
			},
		] as Array<FilterQuery<AccountEntity>>;

		if (email) {
			conditions.push({
				email,
			});
		}

		return this.accountRepository.find(conditions);
	}
}
