import { SESAdapterService } from "../../../src/adapters/implementations/ses/ses.service";
import { type Mock } from "../types";
import { type EmailAdapter } from "../../../src/adapters/email";

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
