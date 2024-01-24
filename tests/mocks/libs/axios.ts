export const makeAxiosMock = () => {
	const mock = {
		post: jest.fn(),
		get: jest.fn(),
	};

	const resetMock = () => {
		mock.post.mockReset();
		mock.get.mockReset();
	};

	return {
		resetMock,
		...mock,
	};
};
