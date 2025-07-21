// svelte-kit sync && svelte-check --tsconfig ./tsconfig.json
import { spawnSync } from "bun";
import { resolve } from "node:path";
import { PROJECT_DIRECTORY } from "./private/constants.mts";
import { log } from "@clack/prompts";

log.step("svelte-kit sync");
const { exitCode: svelteKitExitCode } = spawnSync(
	["bunx", "-b", "svelte-kit", "sync"],
	{
		cwd: resolve(PROJECT_DIRECTORY, "Web"),

		// @ts-expect-error: I think the types are lagging a bit behind the documentation?
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	},
);
if (svelteKitExitCode != 0) {
	process.exit(svelteKitExitCode);
}

log.step("svelte-check --tsconfig ./tsconfig.json");
const { exitCode: checkExitCode } = spawnSync(
	["bunx", "-b", "svelte-check", "--tsconfig", "./tsconfig.json"],
	{
		cwd: resolve(PROJECT_DIRECTORY, "Web"),

		// @ts-expect-error: I think the types are lagging a bit behind the documentation?
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	},
);
process.exit(checkExitCode);
