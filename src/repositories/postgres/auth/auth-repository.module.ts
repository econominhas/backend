import { Module } from '@nestjs/common';
import { AuthRepositoryService } from './auth-repository.service';
import { PostgresModule } from '..';
import { UIDAdapterModule } from 'adapters/implementations/uid/uid.module';

@Module({
	imports: [
		PostgresModule.forFeature(['account', 'signInProvider']),
		UIDAdapterModule,
	],
	providers: [AuthRepositoryService],
	exports: [AuthRepositoryService],
})
export class AuthRepositoryModule {}
