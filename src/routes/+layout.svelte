<script lang="ts">
	import "@fontsource-variable/inter";
	import { assets } from "$app/paths";

	import AccountManager from "./account.svelte";
	const { data, children } = $props();
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
	<AccountManager token={data.sessionToken}></AccountManager>
</header>

<main>
	{@render children()}
</main>

<style>
	header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>
