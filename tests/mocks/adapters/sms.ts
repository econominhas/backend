import { SNSAdapterService } from 'adapters/implementations/sns/sns.service';
import type { SmsAdapter } from 'adapters/sms';
import type { Mock } from '../types';

export const makeSmsAdapterMock = () => {
	const mock: Mock<SmsAdapter> = {
		send: jest.fn(),
	};

	const module = {
		provide: SNSAdapterService,
		useValue: mock,
	};

	return {
		mock,
		module,
	};
};
