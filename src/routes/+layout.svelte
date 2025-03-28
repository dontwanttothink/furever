<script lang="ts">
	const { data, children } = $props();
</script>

<nav>
	{#each data?.routes as route (route.path)}
		<a href={route.path} class="nav-link">{route.name}</a>
	{/each}
</nav>

<main>
	{@render children()}
</main>
