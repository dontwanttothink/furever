import { error, type RequestHandler } from "@sveltejs/kit";
import { assert } from "$lib";
import { cwd, env } from "node:process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const USER_CONTENT = env.USER_CONTENT;
assert(USER_CONTENT);

const USER_CONTENT_PATH = resolve(cwd(), USER_CONTENT);

export const GET: RequestHandler = async ({ params: { uuid } }) => {
	if (!USER_CONTENT || !uuid) {
		throw new TypeError();
	}

	const requestedPath = resolve(USER_CONTENT, uuid);

	if (!requestedPath.startsWith(USER_CONTENT_PATH)) {
		error(403);
	} else {
		let data;
		try {
			data = await readFile(requestedPath);
		} catch (e) {
			if (e instanceof Object && "code" in e && e.code == "ENOENT") {
				error(404);
			}
			throw e;
		}

		return new Response(data, {
			status: 200,
			headers: {
				"Content-Type": "image/jpg",
			},
		});
	}
};
