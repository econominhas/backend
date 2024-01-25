export const makeJwtMock = () => {
	const mock = {
		sign: jest.fn(),
		verify: jest.fn(),
	};

	const resetMock = () => {
		mock.sign.mockReset();
		mock.verify.mockReset();
	};

	return {
		resetMock,
		...mock,
	};
};
