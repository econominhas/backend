import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { RefreshTokenRepositoryService } from './refresh-token-repository.service';
import { JwtUidTokenAdapter } from 'src/adapters/implementations/token.service';

@Module({
	imports: [PostgresModule.forFeature(['refreshToken'])],
	providers: [RefreshTokenRepositoryService, JwtUidTokenAdapter],
	exports: [RefreshTokenRepositoryService],
})
export class RefreshTokenRepositoryModule {}
