// prettier --check . ; eslint .
import { spawnSync } from "bun";
import { resolve } from "node:path";
import { PROJECT_DIRECTORY } from "./private/constants.mts";
import { log } from "@clack/prompts";

log.step("prettier . --check");
const { exitCode: prettierExitCode } = spawnSync(
	["bunx", "-b", "prettier", ".", "--check"],
	{
		cwd: resolve(PROJECT_DIRECTORY, "Web"),

		// @ts-expect-error: I think the types are lagging a bit behind the documentation?
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	},
);

log.step("eslint .");
const { exitCode: eslintExitCode } = spawnSync(["bunx", "-b", "eslint", "."], {
	cwd: resolve(PROJECT_DIRECTORY, "Web"),

	// @ts-expect-error: I think the types are lagging a bit behind the documentation?
	stdin: "inherit",
	stdout: "inherit",
	stderr: "inherit",
});
process.exit(prettierExitCode || eslintExitCode);
