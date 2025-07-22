import "es-arraybuffer-base64/auto";

for (const method of ["fromBase64", "fromHex"]) {
	if (method in Uint8Array) {
		console.warn(
			`The polyfill for Uint8Array.${method} appears to be unnecessary.`,
		);
	}
}
for (const method of ["toHex", "toBase64", "setFromBase64", "setFromHex"]) {
	if (method in Uint8Array.prototype) {
		console.warn(
			`The polyfill for Uint8Array.prototype.${method} appears to be unnecessary.`,
		);
	}
}

declare global {
	interface Uint8ArrayConstructor {
		/**
		 * Creates a new `Uint8Array` from a base64-encoded string.
		 * @param string The base64-encoded string.
		 * @param options If provided, specifies the alphabet and handling of the last chunk.
		 * @returns A new `Uint8Array` instance.
		 * @throws {SyntaxError} If the input string contains characters outside the specified alphabet, or if the last
		 * chunk is inconsistent with the `lastChunkHandling` option.
		 */
		fromBase64(
			string: string,
			options?: {
				alphabet?: "base64" | "base64url";
				lastChunkHandling?: "loose" | "strict" | "stop-before-partial";
			},
		): Uint8Array<ArrayBuffer>;

		/**
		 * Creates a new `Uint8Array` from a base16-encoded string.
		 * @returns A new `Uint8Array` instance.
		 */
		fromHex(string: string): Uint8Array<ArrayBuffer>;
	}

	interface Uint8Array {
		/**
		 * Converts the `Uint8Array` to a base64-encoded string.
		 * @param options If provided, sets the alphabet and padding behavior used.
		 * @returns A base64-encoded string.
		 */
		toBase64(options?: {
			alphabet?: "base64" | "base64url";
			omitPadding?: boolean;
		}): string;

		/**
		 * Sets the `Uint8Array` from a base64-encoded string.
		 * @param string The base64-encoded string.
		 * @param options If provided, specifies the alphabet and handling of the last chunk.
		 * @returns An object containing the number of bytes read and written.
		 * @throws {SyntaxError} If the input string contains characters outside the specified alphabet, or if the last
		 * chunk is inconsistent with the `lastChunkHandling` option.
		 */
		setFromBase64(
			string: string,
			options?: {
				alphabet?: "base64" | "base64url";
				lastChunkHandling?: "loose" | "strict" | "stop-before-partial";
			},
		): {
			read: number;
			written: number;
		};

		/**
		 * Converts the `Uint8Array` to a base16-encoded string.
		 * @returns A base16-encoded string.
		 */
		toHex(): string;

		/**
		 * Sets the `Uint8Array` from a base16-encoded string.
		 * @param string The base16-encoded string.
		 * @returns An object containing the number of bytes read and written.
		 */
		setFromHex(string: string): {
			read: number;
			written: number;
		};
	}
}
