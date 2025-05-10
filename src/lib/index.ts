class AssertionError extends Error {}

/**
 * @throws AssertionError
 */
export function assert(
	condition: unknown,
	message?: string,
): asserts condition {
	if (!condition) {
		throw new AssertionError(message || "Assertion failed");
	}
}

/**
 * Unwraps a nullable value.
 *
 * @example ```typescript
 * function foo(): string | null
 *
 * // throws if foo() returns null
 * unshell(foo()).toUpperCase();
 * ```
 * @throws AssertionError
 */
export function unshell<T>(
	condition: T,
	message?: string,
): T extends null | undefined ? never : NonNullable<T> {
	if (!condition) {
		throw new AssertionError(message || "Assertion failed");
	}
	return condition as T extends null | undefined ? never : NonNullable<T>;
}

export class ExpectedUnreachableError extends Error {
	constructor() {
		super("This code was presumed to be unreachable.");
	}
}

export const titlePrefix = "FureverHome — ";
export const contactEmail = "furever@uq4.net"; // TODO: use an env var (sveltekit static)
