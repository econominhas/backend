import {
	Inject,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { SignInProviderEnum, type Account, type Prisma } from "@prisma/client";

import {
	AuthRepository,
	type CreateInput,
	type GetManyByProviderInput,
	type GetByEmailInput,
	type GetByProviderInput,
	type GetByPhoneInput,
	type CreateWithGoogle,
	type CreateWithPhone,
	type CreateWithEmail,
	type UpdateProviderInput,
	type GetManyByProviderOutput,
} from "models/auth";
import { IdAdapter } from "adapters/id";
import { UIDAdapterService } from "adapters/implementations/uid/uid.service";

import { InjectRepository, Repository } from "..";

@Injectable()
export class AuthRepositoryService extends AuthRepository {
	constructor(
		@InjectRepository("account")
		private readonly accountRepository: Repository<"account">,
		@InjectRepository("signInProvider")
		private readonly signInProviderRepository: Repository<"signInProvider">,

		@Inject(UIDAdapterService)
		private readonly idAdapter: IdAdapter,
	) {
		super();
	}

	create(i: CreateInput): Promise<Account> {
		const accountId = this.idAdapter.genId();

		const baseAccount: Prisma.AccountCreateArgs["data"] = {
			id: accountId,
			config: {
				create: {
					id: accountId,
				},
			},
			onboarding: {
				create: {
					id: accountId,
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

		throw new InternalServerErrorException("Invalid user creation method");
	}

	getByEmail({ email }: GetByEmailInput): Promise<Account | undefined> {
		return this.accountRepository.findUnique({
			where: {
				email,
			},
		});
	}

	getByPhone({ phone }: GetByPhoneInput): Promise<Account | undefined> {
		return this.accountRepository.findUnique({
			where: {
				phone,
			},
		});
	}

	getByProvider({
		provider,
		providerId,
	}: GetByProviderInput): Promise<Account | undefined> {
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

	getManyByProvider({
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
						signInProviders: {
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
		await this.signInProviderRepository.upsert({
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
