<script lang="ts">
	const { token } = $props();
</script>

{#if token}
	<p>{token.slice(0, 10)}…</p>
{:else}
	<p><a href="/iniciar-sesión">Iniciar sesión</a></p>
{/if}

<style>
	p {
		text-align: center;
	}
	a {
		font-weight: 500;
	}
</style>
