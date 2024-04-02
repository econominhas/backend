/**
 *
 * Generates one valid paseto token
 *
 */

import { V4 } from 'paseto';

const accountId: string = 'accountId';
const terms: boolean = true;
const expirationDate: Date = new Date(2024, 0, 1);
const privateKey: string =
	'2MPoBMMJwdnHwx5qIso9RcxR5o3SycCgBgWFeHCE2Oz6uI3sCLGOQLqwdmRAPFmU28UPMc9FGuncPy3tpKq+bg==';

const foo = async () => {
	const secretBuffer = Buffer.from(privateKey, 'base64');
	const secretKeyObject = V4.bytesToKeyObject(secretBuffer);

	console.log(
		await V4.sign(
			{
				sub: accountId,
				terms,
				exp: expirationDate.toISOString(),
			},
			secretKeyObject,
		),
	);
};

foo();
