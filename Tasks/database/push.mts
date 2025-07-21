import { cancel, isCancel, select, log } from "@clack/prompts";
import { resolve } from "node:path";
import { $, sleep, spawn } from "bun";
import { PROJECT_DIRECTORY } from "../private/constants.mts";
import { readdirSync } from "node:fs";

export enum DatabasePushTarget {
	Remote,
	Development,
}
export async function pushTo(target: DatabasePushTarget) {
	$.cwd(resolve(PROJECT_DIRECTORY, "Web"));

	if (target == DatabasePushTarget.Remote) {
		const missingEnvironmentVariables = [
			"CLOUDFLARE_ACCOUNT_ID",
			"CLOUDFLARE_DATABASE_ID",
			"CLOUDFLARE_D1_TOKEN",
		].filter((s) => !(s in process.env));
		if (missingEnvironmentVariables.length > 0) {
			let m = `"${missingEnvironmentVariables[0]}"`;
			for (let i = 1; i < missingEnvironmentVariables.length; ++i) {
				const current = missingEnvironmentVariables[i];
				const remaining = missingEnvironmentVariables.length - i > 1;
				if (!remaining) {
					m += ` and "${current}"`;
				} else {
					m += `, "${current}"`;
				}
			}

			log.error(
				`The environment variable${missingEnvironmentVariables.length > 1 ? "s" : ""}, ${m}, are missing.`,
			);
			log.info(
				"These variables are needed to connect to a remote Cloudflare D1 database." +
					"\nFor more information, please see Docs/remote_database.md.",
			);
		}

		const configPath = resolve(
			PROJECT_DIRECTORY,
			"Tasks",
			"database",
			"configs",
			"drizzle.remote.config.mts",
		);

		log.step("Executing a `drizzle-kit` command…");
		try {
			await $`bunx --bun drizzle-kit push --config ${configPath}`;
		} catch (e) {
			if (
				e instanceof Object &&
				"exitCode" in e &&
				"stdout" in e &&
				"stderr" in e &&
				e.stdout != null &&
				typeof e.stdout.toString == "function" &&
				e.stderr != null &&
				typeof e.stderr.toString == "function"
			) {
				log.error(`The command failed with exit code ${e.exitCode}.`);
				process.exit(1);
			}
			throw e;
		}
	} else if (target == DatabasePushTarget.Development) {
		let miniflareDatabasePath: null | string = null;
		let patience = 1;
		let isFirstAttempt = true;

		const WRANGLER_STORAGE_LOCATION = resolve(
			PROJECT_DIRECTORY,
			"Web",
			".wrangler",
			"state",
			"v3",
			"d1",
			"miniflare-D1DatabaseObject",
		);

		function findMiniflareInternalSqliteDatabase(inPath: string) {
			let children;
			try {
				children = readdirSync(inPath);
			} catch {
				return null;
			}

			for (const child of children) {
				if (child.endsWith(".sqlite")) {
					return resolve(inPath, child);
				}
			}
			return null;
		}

		while (patience < 20) {
			log.step(
				isFirstAttempt
					? "Finding your Miniflare local database…"
					: "Checking again for a Miniflare local database…",
			);
			const maybeMiniflareDbPath = findMiniflareInternalSqliteDatabase(
				WRANGLER_STORAGE_LOCATION,
			);
			if (maybeMiniflareDbPath == null) {
				log.info(
					"Miniflare doesn't seem to have created your local database yet.",
				);
				log.step(
					`Trying${isFirstAttempt ? " " : " once again "}to get it to create one… (${patience} ${patience == 1 ? "second" : "seconds"})`,
				);

				const PORT = 64512;

				const controller = new AbortController();
				const { signal } = controller;
				let viteDev = spawn(
					[
						"bunx",
						"--bun",
						"vite",
						"dev",
						"--port",
						PORT.toString(),
						"--strictPort",
						"--clearScreen",
						"false",
					],
					{
						cwd: resolve(PROJECT_DIRECTORY, "Web"),
						stdout: "inherit",
						stderr: "inherit",
						signal,
					},
				);

				await sleep(patience * 1000);

				if (viteDev.killed) {
					log.error(
						`A command exited unexpectedly with exit code ${viteDev.exitCode}.\nAn explanation may have been printed to the terminal. If no explanation is visible, please submit a report.`,
					);
					process.exit(1);
				}

				try {
					await fetch(`http://localhost:${PORT}/mascotas`);
				} catch {}

				viteDev.kill();

				log.info(
					"You may see a flood of error messages above. This is expected.",
				);

				patience *= 2;
				isFirstAttempt = false;
			} else {
				miniflareDatabasePath = maybeMiniflareDbPath;
				break;
			}
		}

		if (miniflareDatabasePath == null) {
			log.error("Sorry, I couldn't find or create a Miniflare local database.");
			log.info(
				"Try starting a development server with `bun -b dev`, quitting it, and running this task again.\nThe development server will be minimally functional until this task completes successfully.",
			);
			process.exit(1);
		}

		log.step("Executing a `drizzle-kit` command…");

		const configPath = resolve(
			PROJECT_DIRECTORY,
			"Tasks",
			"database",
			"configs",
			"drizzle.local.config.mts",
		);
		try {
			await $`__DETECTED_WRANGLER_INTERNAL_SQLITE_DB=${miniflareDatabasePath} bunx --bun drizzle-kit push --config ${configPath}`;
		} catch (e) {
			if (
				e instanceof Object &&
				"exitCode" in e &&
				"stdout" in e &&
				"stderr" in e &&
				e.stdout != null &&
				typeof e.stdout.toString == "function" &&
				e.stderr != null &&
				typeof e.stderr.toString == "function"
			) {
				log.error(`The command failed with exit code ${e.exitCode}.`);
				process.exit(1);
			}
			throw e;
		}
	} else {
		throw new Error(`The target ${target} is not implemented.`);
	}
	log.success("Done!");
}

async function main() {
	const target = await select({
		message: "What do you want to push to?",
		options: [
			{
				value: DatabasePushTarget.Development,
				label: "Development database on this machine",
				hint: "the database used when you run FureverHome locally",
			},
			{
				value: DatabasePushTarget.Remote,
				label: "Remote database",
				hint: "a remote Cloudflare D1 database",
			},
		],
	});

	if (isCancel(target)) {
		cancel("Cancelled.");
		process.exit(1);
	}

	await pushTo(target);
}
if (import.meta.main) {
	await main();
}
