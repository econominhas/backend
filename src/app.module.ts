import { Module } from '@nestjs/common';
import { AccountModule } from './usecases/account/account.module';
import { PostgresModule } from './repositories/postgres';

@Module({
	imports: [PostgresModule.forRoot(), AccountModule],
})
export class AppModule {}
