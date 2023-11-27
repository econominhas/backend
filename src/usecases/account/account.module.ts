import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountRepositoryModule } from 'src/repositories/postgres/account/account-repository.module';
import { AccountController } from 'src/delivery/account.controller';

@Module({
	controllers: [AccountController],
	imports: [AccountRepositoryModule],
	providers: [AccountService],
	exports: [AccountService],
})
export class AccountModule {}
