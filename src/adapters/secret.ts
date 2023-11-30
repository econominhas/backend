export abstract class SecretAdapter {
	abstract genSecret(): string;

	abstract genSuperSecret(): string;
}
