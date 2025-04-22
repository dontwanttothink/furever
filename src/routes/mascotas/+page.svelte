<script lang="ts">
	import LinkButton from "$lib/components/LinkButton.svelte";
	import { titlePrefix } from "$lib";
	const { data } = $props();
	const { recentPets } = data;
</script>

<svelte:head>
	<title>{titlePrefix}Mascotas</title>
</svelte:head>

<h1>Mascotas</h1>

<ul>
	{#each recentPets as pet (pet.id)}
		<li>
			<a href={`/mascotas/${pet.id}`}>
				{pet.name}
			</a>
		</li>
	{/each}
</ul>

<LinkButton href="/mascotas/crear">Crear nueva mascota</LinkButton>

<style>
</style>
