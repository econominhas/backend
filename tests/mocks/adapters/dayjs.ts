import type { Mock } from '../types';
import type { DateAdapter } from 'adapters/date';
import { DayjsAdapterService } from 'adapters/implementations/dayjs/dayjs.service';

export const makeDayjsAdapterMock = () => {
	const mock: Mock<DateAdapter> = {
		today: jest.fn(),
		newDate: jest.fn(),
		get: jest.fn(),
		diff: jest.fn(),
		getDayOfWeek: jest.fn(),
		getNextMonths: jest.fn(),
		format: jest.fn(),
		statementDate: jest.fn(),
		dueDate: jest.fn(),
		isSameMonth: jest.fn(),
		isAfterToday: jest.fn(),
		nowPlus: jest.fn(),
		setDay: jest.fn(),
		add: jest.fn(),
		sub: jest.fn(),
		startOf: jest.fn(),
		endOf: jest.fn(),
	};

	const module = {
		provide: DayjsAdapterService,
		useValue: mock,
	};

	return {
		mock,
		module,
	};
};
