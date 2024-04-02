/**
 *
 * Generates one or more user IDs
 *
 */

import { createInterface } from 'readline';
import { uid } from 'uid/secure';

import { UIDAdapterService } from 'adapters/implementations/uid/uid.service';

const inquirer = createInterface({
	input: process.stdin,
	output: process.stdout,
});

inquirer.question('How many IDs should be created?\n', (amount) => {
	const amountNbr = parseInt(amount, 10);

	const idAdapter = new UIDAdapterService(uid);

	Array(amountNbr)
		.fill(0)
		.forEach(() => {
			console.log(idAdapter.genId());
		});

	inquirer.close();
});

inquirer.on('close', function () {
	process.exit(0);
});
