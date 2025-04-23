<!-- FIXME: This might not be accessible and is definitely not semantic.
 Expect misbehavior until it's replaced with a properly-styled anchor element.
 -->

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
