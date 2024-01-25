export const makeJwtMock = () => ({
	sign: jest.fn(),
	verify: jest.fn(),
});
