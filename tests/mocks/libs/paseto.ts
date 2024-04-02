export const makePasetoMock = () => ({
	sign: jest.fn(),
	bytesToKeyObject: jest.fn(),
	verify: jest.fn(),
});
