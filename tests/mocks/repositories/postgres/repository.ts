export interface PostgresMock {
	find: jest.Mock<any, any>;
	findOne: jest.Mock<any, any>;
	findAndCount: jest.Mock<any, any>;
	save: jest.Mock<any, any>;
	insert: jest.Mock<any, any>;
	update: jest.Mock<any, any>;
	delete: jest.Mock<any, any>;
}

export const makePostgresMock = () => ({
	find: jest.fn(),
	findOne: jest.fn(),
	findAndCount: jest.fn(),
	save: jest.fn(),
	insert: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
});
