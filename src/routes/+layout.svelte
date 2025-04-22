<script lang="ts">
	import "@fontsource-variable/inter";
	import { assets } from "$app/paths";

	import AccountManager from "./AccountManager.svelte";
	let { data, children } = $props();
	let { userData } = $derived(data);
</script>

<sveltekit:head>
	<link rel="preload" href="{assets}/centered.css" as="style" />
</sveltekit:head>

<header>
	<nav>
		{#each data?.routes as route (route.path)}
			<a href={route.path} class="nav-link">{route.name}</a>
		{/each}
	</nav>
	<AccountManager {userData}></AccountManager>
</header>

<main>
	{@render children()}
</main>

<footer>
	<noscript>
		<p>
			JavaScript está desactivado. Algunas funciones del sitio no funcionarán
			correctamente.
		</p>
	</noscript>

	<p>
		<span id="copy">Copyright &copy; 2025</span> <br />santi_nubuwu y los
		colaboradores de FureverHome
	</p>

	<p><a href="/privacidad">Información sobre la privacidad</a></p>
</footer>

<style>
	header {
		display: flex;
		gap: 1em;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	footer {
		border-top: 1px solid rgb(0 0 0 / 7%);
		margin-top: 3rem;
		font-size: 0.9rem;
		text-align: center;
		font-weight: 300;

		a {
			font-weight: 400;
		}
	}

	#copy {
		font-weight: 500;
	}
</style>
