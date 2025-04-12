<script lang="ts">
	import { assets } from "$app/paths";
	import { page } from "$app/state";
	import { titlePrefix } from "$lib/misc";
</script>

<svelte:head>
	<title>{titlePrefix}No Encontrado</title>
	<meta name="description" content="La página no se pudo encontrar." />

	<!-- We do this because we need to modify the 'body' and 'main' elements. We
	can't simply use :global(xxx), or the styles will persist even after the
	user navigates elsewhere. C'est fou. -->
	<link rel="stylesheet" href="{assets}/centered.css" />
</svelte:head>

<div>
	<h1>{page.status}</h1>
	<p>Lo sentimos. Hubo un error.</p>

	<p class="raw-error">
		{page.error?.message ?? "[No se proporcionó un mensaje de error.]"}
	</p>
</div>

<style>
	div {
		text-align: center;
	}

	h1 {
		font-size: 6rem;
		font-weight: 450;
		line-height: 1;
		margin-bottom: 0.5rem;
	}

	p {
		margin-top: 0rem;
		font-size: 2rem;
	}

	.raw-error {
		font-family: monospace;
		font-size: 1rem;
		opacity: 90%;
	}
</style>
