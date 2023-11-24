import { Module } from '@nestjs/common';
import { MagicLinkCodeRepositoryService } from './magic-link-code-repository.service';
import { UIDSecretAdapter } from 'src/adapters/implementations/uid-secret.service';
import { PostgresModule } from '..';

@Module({
	imports: [PostgresModule.forFeature(['magicLinkCode'])],
	providers: [MagicLinkCodeRepositoryService, UIDSecretAdapter],
	exports: [MagicLinkCodeRepositoryService],
})
export class MagicLinkCodeRepositoryModule {}
