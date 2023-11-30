import { Module } from '@nestjs/common';
import { MagicLinkCodeRepositoryService } from './magic-link-code-repository.service';
import { PostgresModule } from '..';
import { UIDAdapterModule } from 'src/adapters/implementations/uid/uid.module';

@Module({
	imports: [PostgresModule.forFeature(['magicLinkCode']), UIDAdapterModule],
	providers: [MagicLinkCodeRepositoryService],
	exports: [MagicLinkCodeRepositoryService],
})
export class MagicLinkCodeRepositoryModule {}
