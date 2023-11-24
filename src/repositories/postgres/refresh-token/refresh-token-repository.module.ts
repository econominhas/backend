import { Module } from '@nestjs/common';
import { PostgresTable } from '..';
import { RefreshTokenRepositoryService } from './refresh-token-repository.service';
import { RefreshTokenEntity } from 'src/models/refresh-token';
import { TokenAdapter } from 'src/adapters/implementations/token.service';

@Module({
	imports: [PostgresTable([RefreshTokenEntity])],
	providers: [RefreshTokenRepositoryService, TokenAdapter],
	exports: [RefreshTokenRepositoryService],
})
export class RefreshTokenRepositoryModule {}
