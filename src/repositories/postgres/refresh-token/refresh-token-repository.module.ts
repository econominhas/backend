import { Module } from '@nestjs/common';
import { PostgresModule } from '..';
import { RefreshTokenRepositoryService } from './refresh-token-repository.service';
import { PasetoAdapterModule } from 'adapters/implementations/paseto/paseto.module';

@Module({
	imports: [PostgresModule.forFeature(['refreshToken']), PasetoAdapterModule],
	providers: [RefreshTokenRepositoryService],
	exports: [RefreshTokenRepositoryService],
})
export class RefreshTokenRepositoryModule {}
