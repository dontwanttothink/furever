// prettier --check . ; eslint .
import { spawnSync } from "bun";
import { resolve } from "node:path";
import { PROJECT_DIRECTORY } from "./private/constants.mts";
import { log } from "@clack/prompts";

log.step("prettier . --check");
const { exitCode: prettierExitCode } = spawnSync(
	["bunx", "-b", "prettier", ".", "--check"],
	{
		cwd: PROJECT_DIRECTORY, // Prettier is configured project-wide

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

if (prettierExitCode && !eslintExitCode) {
	log.error("There were Prettier issues. No ESLint issues were detected.");
	log.message("Try `bun format`.");
} else if (eslintExitCode && !prettierExitCode) {
	log.error("There were ESLint issues. No Prettier issues were detected.");
} else if (eslintExitCode && prettierExitCode) {
	log.error("There were ESLint and Prettier issues.");
} else {
	log.success("No issues were detected.");
}

process.exit(prettierExitCode || eslintExitCode);
