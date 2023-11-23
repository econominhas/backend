import { Module } from '@nestjs/common';
import { AccountRepositoryService } from './account-repository.service';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import { AccountEntity } from 'src/models/account';
import { PostgresTable } from '..';

@Module({
	imports: [PostgresTable([AccountEntity])],
	providers: [AccountRepositoryService, UIDAdapter],
	exports: [AccountRepositoryService],
})
export class AccountRepositoryModule {}
