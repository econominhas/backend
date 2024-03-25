import type { SmsAdapter } from 'adapters/sms';
import type { Mock } from '../types';
import { SNSSMSAdapterService } from 'adapters/implementations/sns-sms/sns.service';

export const makeSmsAdapterMock = () => {
	const mock: Mock<SmsAdapter> = {
		send: jest.fn(),
	};

	const module = {
		provide: SNSSMSAdapterService,
		useValue: mock,
	};

	return {
		mock,
		module,
	};
};
