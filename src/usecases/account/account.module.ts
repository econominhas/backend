import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountRepositoryModule } from 'repositories/postgres/account/account-repository.module';
import { AccountController } from 'delivery/account.controller';

@Module({
	controllers: [AccountController],
	imports: [AccountRepositoryModule],
	providers: [AccountService],
	exports: [AccountService],
})
export class AccountModule {}
