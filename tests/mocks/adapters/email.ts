import type { EmailAdapter } from 'adapters/email';
import { SESAdapterService } from 'adapters/implementations/ses/ses.service';
import type { Mock } from '../types';

export const makeEmailAdapterMock = () => {
	const mock: Mock<EmailAdapter> = {
		send: jest.fn(),
	};

	const module = {
		provide: SESAdapterService,
		useValue: mock,
	};

	return {
		mock,
		module,
	};
};
