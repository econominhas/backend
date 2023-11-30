import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { RefreshTokenRepositoryService } from './refresh-token-repository.service';
import { JWTAdapterModule } from 'src/adapters/implementations/jwt/token.module';

@Module({
	imports: [PostgresModule.forFeature(['refreshToken']), JWTAdapterModule],
	providers: [RefreshTokenRepositoryService],
	exports: [RefreshTokenRepositoryService],
})
export class RefreshTokenRepositoryModule {}
