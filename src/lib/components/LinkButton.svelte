<script lang="ts">
	import { enhance } from "$app/forms";

	const { href, children } = $props();
</script>

<form method="GET" action={href} use:enhance>
	<button>{@render children()}</button>
</form>

<style>
	form {
		width: fit-content;
		margin: 0 auto;
	}
</style>
