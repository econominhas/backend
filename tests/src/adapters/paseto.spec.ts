import { PasetoAdapterService } from 'adapters/implementations/paseto/token.service';
import { makePasetoMock } from '../../mocks/libs/paseto';
import { UIDAdapterModule } from 'adapters/implementations/uid/uid.module';
import { configMockModule } from '../../mocks/config';
import { createTestModule, createTestService } from '../../utils';
import { INestApplication } from '@nestjs/common';
import { PasetoAdapterModule } from 'adapters/implementations/paseto/token.module';


describe('Adapters > PASETO', () => {
    let service: PasetoAdapterService;
    let module: INestApplication;

    const pasetoMock = makePasetoMock();

    beforeAll(async () => {
        try {
            service = await createTestService<PasetoAdapterService>(PasetoAdapterService, {
                imports: [UIDAdapterModule],
                providers: [
                    {
                        provide: 'paseto',
                        useValue: pasetoMock,
                    },
                    configMockModule,
                ],
            });

            module = await createTestModule(PasetoAdapterModule);
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

    describe('> genAccess', () => {
        it('should generate access token', async () => {

            pasetoMock.bytesToKeyObject.mockReturnValue('secretKeyObject')
            pasetoMock.sign.mockReturnValue('accessToken')

            const payload = {
                accountId: 'accountId',
                hasAcceptedLatestTerms: true,
            };
            let result;
            try {
                result = await service.genAccess(
                    payload
                );
            } catch (err) {
                result = err;
            }

            expect(pasetoMock.bytesToKeyObject).toHaveBeenCalled()
            expect(pasetoMock.sign).toHaveBeenCalled()
            expect(pasetoMock.sign).toHaveBeenCalledWith({ sub: payload.accountId, terms: payload.hasAcceptedLatestTerms }, 'secretKeyObject')
            expect(result).toStrictEqual({ accessToken: 'accessToken', expiresAt: '' })

        });
    });

    describe('> validateAccess', () => {
        it('should return payload from access token', async () => {
            const accessToken = 'access_token';
            const payload = {
                sub: 'accountId',
                terms: true,
            };

            pasetoMock.bytesToKeyObject.mockReturnValue('secretKeyObject')
            pasetoMock.verify.mockResolvedValue(payload);

            let result;
            try {
                result = await service.validateAccess({ accessToken });
            } catch (err) {
                result = err;
            }

            expect(pasetoMock.verify).toHaveBeenCalled();
            expect(pasetoMock.verify).toHaveBeenCalledWith(accessToken, 'secretKeyObject');

            expect(result).toEqual(payload);
        });

        it('should return undefined if error', async () => {
            const accessToken = 'access_token';

            pasetoMock.verify.mockRejectedValue(new Error('Token validation failed'));
            pasetoMock.bytesToKeyObject.mockReturnValue('secretKeyObject')

            let result;
            try {
                result = await service.validateAccess({ accessToken });
            } catch (err) {
                result = err;
            }
            expect(pasetoMock.verify).toHaveBeenCalled();
            expect(pasetoMock.verify).toHaveBeenCalledWith(accessToken, 'secretKeyObject');

            expect(result).toBeUndefined();
        });
    });


    describe('> genRefresh', () => {
        it('should generate refresh token', async () => {
            let result;
            try {
                result = await service.genRefresh();
            } catch (err) {
                result = err;
            }

            expect(result).not.toBeInstanceOf(Error);
            expect(result).toHaveProperty('refreshToken');
            expect(result.refreshToken).toHaveLength(64);
            expect(result.refreshToken).toMatch(/^[a-fA-F0-9]*$/);
        });
    });
})
