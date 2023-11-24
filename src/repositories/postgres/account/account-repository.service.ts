import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
	AccountEntity,
	AccountRepository,
	CreateInput,
	GetByIdInput,
	GetManyByProviderInput,
	GetByEmailInput,
	GetByProviderInput,
	GetByPhoneInput,
	CreateWithGoogle,
	CreateWithPhone,
	CreateWithEmail,
	UpdateProviderInput,
} from 'src/models/account';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { FilterQuery, RequiredEntityData } from '@mikro-orm/core';
import { SignInProviderEnum } from 'src/types/enums/sign-in-provider';
import { SignInProviderEntity } from 'src/models/sign-in-provider';

@Injectable()
export class AccountRepositoryService extends AccountRepository {
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountRepository: EntityRepository<AccountEntity>,
		@InjectRepository(SignInProviderEntity)
		private readonly providerRepository: EntityRepository<SignInProviderEntity>,
		private readonly idAdapter: UIDAdapter,
	) {
		super();
	}

	async create(i: CreateInput): Promise<AccountEntity> {
		const baseAccount: RequiredEntityData<AccountEntity> = {
			id: this.idAdapter.gen(),
			config: {
				timezone: i.timezone,
			},
		};

		const iAsGoogle = i as CreateWithGoogle;
		if (iAsGoogle.google) {
			return this.accountRepository.create({
				...baseAccount,
				email: iAsGoogle.email,
				signInProviders: [
					{
						provider: SignInProviderEnum.GOOGLE,
						providerId: iAsGoogle.google.id,
						accessToken: iAsGoogle.google.accessToken,
						refreshToken: iAsGoogle.google.refreshToken,
						expiresAt: iAsGoogle.google.expiresAt,
					},
				],
			});
		}

		const iAsPhone = i as CreateWithPhone;
		if (iAsPhone.phone) {
			return this.accountRepository.create({
				...baseAccount,
				phone: iAsPhone.phone,
			});
		}

		const iAsEmail = i as CreateWithEmail;
		if (iAsEmail.email) {
			return this.accountRepository.create({
				...baseAccount,
				email: iAsEmail.email,
			});
		}

		throw new InternalServerErrorException('Invalid user creation method');
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

	async updateGoogle({
		accountId,
		provider,
		providerId,
		accessToken,
		refreshToken,
		expiresAt,
	}: UpdateProviderInput): Promise<void> {
		await this.providerRepository.upsert({
			accountId,
			provider,
			providerId,
			accessToken,
			refreshToken,
			expiresAt,
		});
	}
}
