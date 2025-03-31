import { PASSWORD_DATA_SEPARATOR } from "./internal";

export function checkPassword(given: string, stored: string) {
	const [salt, hash] = stored.split(PASSWORD_DATA_SEPARATOR);
	const saltedGiven = given + salt;
}
