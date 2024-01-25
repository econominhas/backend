import { UIDAdapterModule } from 'adapters/implementations/uid/uid.module';
import type { INestApplication } from '@nestjs/common';
import { UIDAdapterService } from 'adapters/implementations/uid/uid.service';
import { uid } from 'uid/secure';
import { createTestModule, createTestService } from '../../utils';

describe('Adapters > UID', () => {
	let service: UIDAdapterService;
	let module: INestApplication;

	beforeAll(async () => {
		try {
			service = await createTestService<UIDAdapterService>(UIDAdapterService, {
				providers: [
					{
						provide: 'uid/secure',
						useValue: uid,
					},
				],
			});

			module = await createTestModule(UIDAdapterModule);
		} catch (err) {
			console.error(err);
		}
	});

	describe('definitions', () => {
		it('should initialize Service', () => {
			expect(service).toBeDefined();
		});

		it('should initialize Module', async () => {
			expect(module).toBeDefined();
		});
	});

	describe('> genId', () => {
		it('should generate ID', async () => {
			let result;
			try {
				result = service.genId();
			} catch (err) {
				result = err;
			}

			expect(typeof result).toBe('string');
			expect(result).toHaveLength(16);
			expect(result).toMatch(/^[a-fA-F0-9]*$/);
		});
	});

	describe('> genSecret', () => {
		it('should generate Secret', async () => {
			let result;
			try {
				result = service.genSecret();
			} catch (err) {
				result = err;
			}

			expect(typeof result).toBe('string');
			expect(result).toHaveLength(32);
			expect(result).toMatch(/^[a-fA-F0-9]*$/);
		});
	});

	describe('> genSuperSecret', () => {
		it('should generate Super Secret', async () => {
			let result;
			try {
				result = service.genSuperSecret();
			} catch (err) {
				result = err;
			}

			expect(typeof result).toBe('string');
			expect(result).toHaveLength(64);
			expect(result).toMatch(/^[a-fA-F0-9]*$/);
		});
	});
});
