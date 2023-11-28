import { Module } from '@nestjs/common';
import { MagicLinkCodeRepositoryService } from './magic-link-code-repository.service';
import { PostgresModule } from '..';
import { UIDAdapter } from 'src/adapters/implementations/uid.service';

@Module({
	imports: [PostgresModule.forFeature(['magicLinkCode'])],
	providers: [MagicLinkCodeRepositoryService, UIDAdapter],
	exports: [MagicLinkCodeRepositoryService],
})
export class MagicLinkCodeRepositoryModule {}
