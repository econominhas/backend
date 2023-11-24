import { Module } from '@nestjs/common';
import { PostgresTable } from '..';
import { MagicLinkCodeRepositoryService } from './magic-link-code-repository.service';
import { MagicLinkCodeEntity } from 'src/models/magic-link-code';
import { UIDSecretAdapter } from 'src/adapters/implementations/uid-secret.service';

@Module({
	imports: [PostgresTable([MagicLinkCodeEntity])],
	providers: [MagicLinkCodeRepositoryService, UIDSecretAdapter],
	exports: [MagicLinkCodeRepositoryService],
})
export class MagicLinkCodeRepositoryModule {}
