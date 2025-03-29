<script lang="ts">
	import { assets } from "$app/paths";

	const { data, children } = $props();
</script>

<sveltekit:head>
	<link rel="preload" href="{assets}/centered.css" as="style" />
</sveltekit:head>

<nav>
	{#each data?.routes as route (route.path)}
		<a href={route.path} class="nav-link">{route.name}</a>
	{/each}
</nav>

<main>
	{@render children()}
</main>
