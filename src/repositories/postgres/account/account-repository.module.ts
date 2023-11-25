import { Module } from '@nestjs/common';
import { AccountRepositoryService } from './account-repository.service';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';
import { PostgresModule } from '..';

@Module({
	imports: [PostgresModule.forFeature(['account', 'signInProvider', 'config'])],
	providers: [AccountRepositoryService, UIDAdapter],
	exports: [AccountRepositoryService],
})
export class AccountRepositoryModule {}
