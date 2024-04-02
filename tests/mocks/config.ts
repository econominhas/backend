import { ConfigService } from '@nestjs/config';

export const makeConfigMock = () => {
	const mock = new Map<string, string>();

	mock.set('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_ID');
	mock.set('GOOGLE_CLIENT_SECRET', 'GOOGLE_CLIENT_SECRET');
	mock.set('PASETO_PRIVATE_KEY', 'PASETO_PRIVATE_KEY');

	const module = {
		provide: ConfigService,
		useValue: mock,
	};

	return {
		mock,
		module,
	};
};
