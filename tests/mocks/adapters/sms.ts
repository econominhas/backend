import { SNSSMSAdapterService } from "../../../src/adapters/implementations/sns-sms/sns.service";
import { type SmsAdapter } from "../../../src/adapters/sms";
import { type Mock } from "../types";

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
