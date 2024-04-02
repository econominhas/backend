import { SNSAdapterService } from "../../../src/adapters/implementations/sns/sns.service";
import { type Mock } from "../types";
import { type TopicAdapter } from "../../../src/adapters/topic";

export const makeTopicAdapterMock = () => {
	const mock: Mock<TopicAdapter> = {
		send: jest.fn(),
		sendSecure: jest.fn(),
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
