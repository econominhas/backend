export interface PostgresMock {
	find: jest.Mock;
	findOne: jest.Mock;
	findAndCount: jest.Mock;
	save: jest.Mock;
	insert: jest.Mock;
	update: jest.Mock;
	delete: jest.Mock;
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
