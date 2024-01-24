import { ConfigService } from '@nestjs/config';

const configMock = new Map<string, string>();

configMock.set('GOOGLE_CLIENT_ID', 'foo');
configMock.set('GOOGLE_CLIENT_SECRET', 'bar');

const configMockModule = {
	provide: ConfigService,
	useValue: configMock,
};

export { configMock, configMockModule };
