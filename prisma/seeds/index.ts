import { PrismaClient } from '@prisma/client';
import { bankProviders } from './bank-providers';
import { cardProviders } from './card-providers';

const bootstrap = async () => {
	const prisma = new PrismaClient();

	try {
		await bankProviders(prisma);

		await cardProviders(prisma);

		await prisma.$disconnect();
		process.exit(0);
	} catch (err) {
		console.error(err);
		await prisma.$disconnect();
		process.exit(1);
	}
};

bootstrap();
