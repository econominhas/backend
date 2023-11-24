import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountRepositoryModule } from 'src/repositories/postgres/account/account-repository.module';
import { TokenAdapter } from 'src/adapters/implementations/jwt.service';
import { AuthController } from 'src/delivery/auth.controller';
import { GoogleAdapter } from 'src/adapters/implementations/google.service';
import { SESAdapter } from 'src/adapters/implementations/ses.service';

@Module({
	controllers: [AuthController],
	imports: [AccountRepositoryModule],
	providers: [AccountService, GoogleAdapter, TokenAdapter, SESAdapter],
})
export class AccountModule {}
