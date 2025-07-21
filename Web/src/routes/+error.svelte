<script lang="ts">
	import { assets } from "$app/paths";
	import { page } from "$app/state";
	import { titlePrefix } from "$lib";

	function beepBoop() {
		const n = Math.floor(Math.random() * 5 + 3);
		let out = [];
		for (let i = 0; i < n; ++i) {
			if (Math.random() < 0.5) {
				out.push("beep");
			} else {
				out.push("boop");
			}

			if (Math.random() < 0.2) {
				out[out.length - 1] += ".";
			}
		}
		return out.join(" ");
	}
</script>

<svelte:head>
	<title>{titlePrefix}Error {page.status}</title>
	<meta name="description" content="La página no se pudo encontrar." />

	<!-- We do this because we need to modify the 'body' and 'main' elements. We
	can't simply use :global(xxx), or the styles will persist even after the
	user navigates elsewhere. C'est fou. -->
	<link rel="stylesheet" href="{assets}/centered.css" />
</svelte:head>

<div>
	<h1>{page.status}</h1>
	<p>Lo sentimos. Hubo un error.</p>

	<p class="raw-error">{beepBoop()}</p>
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
