// vite dev
import { spawnSync } from "bun";
import { resolve } from "node:path";
import { PROJECT_DIRECTORY } from "./private/constants.mts";

const { exitCode } = spawnSync(
	["bunx", "-b", "vite", "dev", ...process.argv.slice(2)],
	{
		cwd: resolve(PROJECT_DIRECTORY, "Web"),

		// @ts-expect-error: I think the types are lagging a bit behind the documentation?
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	},
);
process.exit(exitCode);
