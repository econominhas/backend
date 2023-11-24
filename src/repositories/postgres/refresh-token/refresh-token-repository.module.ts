import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { RefreshTokenRepositoryService } from './refresh-token-repository.service';
import { TokenAdapter } from 'src/adapters/implementations/token.service';

@Module({
	imports: [PostgresModule.forFeature(['refreshToken'])],
	providers: [RefreshTokenRepositoryService, TokenAdapter],
	exports: [RefreshTokenRepositoryService],
})
export class RefreshTokenRepositoryModule {}
