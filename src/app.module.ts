import { Module } from '@nestjs/common';
import { AccountModule } from './usecases/account/account.module';
import { TermsModule } from './usecases/terms/terms.module';
import { DocumentModule } from './usecases/document/document.module';
import { NotificationModule } from './usecases/notification/notification.module';
import { StoreModule } from './usecases/store/store.module';
import { ProductModule } from './usecases/product/product.module';
import { ContentModule } from './usecases/content/content.module';
import { SaleModule } from './usecases/sale/sale.module';
import { TransactionModule } from './usecases/transaction/transaction.module';
import { PostgresModule } from './repositories/postgres';

@Module({
	imports: [
		PostgresModule,
		AccountModule,
		TermsModule,
		DocumentModule,
		NotificationModule,
		StoreModule,
		ProductModule,
		ContentModule,
		SaleModule,
		TransactionModule,
	],
})
export class AppModule {}
