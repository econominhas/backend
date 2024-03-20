import { ConfigService } from '@nestjs/config';

const configMock = new Map<string, string>();

configMock.set('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_ID');
configMock.set('GOOGLE_CLIENT_SECRET', 'GOOGLE_CLIENT_SECRET');
configMock.set('PASETO_SECRET', 'PASETO_SECRET');

const configMockModule = {
	provide: ConfigService,
	useValue: configMock,
};

export { configMock, configMockModule };
