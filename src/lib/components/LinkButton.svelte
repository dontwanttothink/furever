<script lang="ts">
	const { href, children } = $props();
</script>

<form method="GET" action={href}>
	<button>{@render children()}</button>
</form>

<style>
	form {
		width: fit-content;
		margin: 0 auto;
	}
</style>
