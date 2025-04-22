export function assert(
	condition: unknown,
	message?: string,
): asserts condition {
	if (!condition) {
		throw new Error(message || "Assertion failed");
	}
}

export class ExpectedUnreachableError extends Error {
	constructor() {
		super("This code was presumed to be unreachable.");
	}
}

export const titlePrefix = "FureverHome — ";
