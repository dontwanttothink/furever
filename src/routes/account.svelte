<script lang="ts">
	const { token } = $props();
</script>

<div id="container">
	{#if token}
		<p>{token.slice(0, 10)}…</p>
	{:else}
		<a href="/iniciar-sesión">Iniciar sesión</a>
	{/if}
</div>

<style>
	#container {
		margin: 1em;
	}
	a {
		font-weight: 500;
	}
</style>
