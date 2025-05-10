<script lang="ts">
	import { assert } from "$lib";

	const { children, message } = $props();
	let modal: HTMLDialogElement | null = $state(null);

	export function cancel() {
		assert(modal instanceof HTMLDialogElement);
		modal.close();
	}
</script>

<dialog bind:this={modal}>
	{@render children()}
</dialog>
<button
	onclick={() => {
		assert(modal instanceof HTMLDialogElement);
		modal.showModal();
	}}>{message}…</button
>
