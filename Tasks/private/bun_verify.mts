import { log } from "@clack/prompts";
import { which, sleep } from "bun";

const nodeExecutable = which("node");

if (nodeExecutable && nodeExecutable.includes("bun-node")) {
	// do nothing
} else {
	log.warn('Run commands with "bun run --bun <command>".');
	log.info("Giving you a moment to cancel…");
	await sleep(1700);
}
