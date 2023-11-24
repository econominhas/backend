import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
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
	GetManyByProviderOutput,
	GetByIdWithProvidersOutput,
} from 'src/models/account';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import { InjectRepository, Repository } from '..';
import { Account, Prisma, SignInProviderEnum } from '@prisma/client';

@Injectable()
export class AccountRepositoryService extends AccountRepository {
	constructor(
		@InjectRepository('account')
		private readonly accountRepository: Repository<'account'>,
		@InjectRepository('signInProvider')
		private readonly providerRepository: Repository<'signInProvider'>,

		private readonly idAdapter: UIDAdapter,
	) {
		super();
	}

	async create(i: CreateInput): Promise<Account> {
		const accountId = this.idAdapter.gen();

		const baseAccount: Prisma.AccountCreateInput = {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			id: accountId,
			Config: {
				create: {
					accountId,
					timezone: i.timezone,
				},
			},
		};

		const iAsGoogle = i as CreateWithGoogle;
		if (iAsGoogle.google) {
			return this.accountRepository.create({
				data: {
					...baseAccount,
					email: iAsGoogle.email,
					signInProviders: {
						create: {
							provider: SignInProviderEnum.GOOGLE,
							providerId: iAsGoogle.google.id,
							accessToken: iAsGoogle.google.accessToken,
							refreshToken: iAsGoogle.google.refreshToken,
							expiresAt: iAsGoogle.google.expiresAt,
						},
					},
				},
			});
		}

		const iAsPhone = i as CreateWithPhone;
		if (iAsPhone.phone) {
			return this.accountRepository.create({
				data: {
					...baseAccount,
					phone: iAsPhone.phone,
				},
			});
		}

		const iAsEmail = i as CreateWithEmail;
		if (iAsEmail.email) {
			return this.accountRepository.create({
				data: {
					...baseAccount,
					email: iAsEmail.email,
				},
			});
		}

		throw new InternalServerErrorException('Invalid user creation method');
	}

	async getById({ id }: GetByIdInput): Promise<undefined | Account> {
		return this.accountRepository.findFirst({
			where: {
				id,
			},
		});
	}

	async getByIdWithProviders({
		id,
	}: GetByIdInput): Promise<undefined | GetByIdWithProvidersOutput> {
		return this.accountRepository.findFirst({
			include: {
				signInProviders: true,
			},
			where: {
				id,
			},
		});
	}

	async getByEmail({ email }: GetByEmailInput): Promise<undefined | Account> {
		return this.accountRepository.findFirst({
			where: {
				email,
			},
		});
	}

	async getByPhone({ phone }: GetByPhoneInput): Promise<undefined | Account> {
		return this.accountRepository.findFirst({
			where: {
				phone,
			},
		});
	}

	async getByProvider({
		provider,
		providerId,
	}: GetByProviderInput): Promise<undefined | Account> {
		return this.accountRepository.findFirst({
			where: {
				signInProviders: {
					every: {
						provider,
						providerId,
					},
				},
			},
		});
	}

	async getManyByProvider({
		provider,
		providerId,
		email,
	}: GetManyByProviderInput): Promise<GetManyByProviderOutput> {
		return this.accountRepository.findMany({
			include: {
				signInProviders: true,
			},
			where: {
				OR: [
					{
						SignInProvider: {
							every: {
								provider,
								providerId,
							},
						},
					},
					email
						? {
								email,
						  }
						: undefined,
				].filter(Boolean),
			},
		});
	}

	async updateProvider({
		accountId,
		provider,
		providerId,
		accessToken,
		refreshToken,
		expiresAt,
	}: UpdateProviderInput): Promise<void> {
		await this.providerRepository.upsert({
			where: {
				accountId_provider_providerId: {
					accountId,
					provider,
					providerId,
				},
			},
			create: {
				accountId,
				provider,
				providerId,
				accessToken,
				refreshToken,
				expiresAt,
			},
			update: {
				accountId,
				provider,
				providerId,
				accessToken,
				refreshToken,
				expiresAt,
			},
		});
	}
}
