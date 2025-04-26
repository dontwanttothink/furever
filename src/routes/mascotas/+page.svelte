<script lang="ts">
	import LinkButton from "$lib/components/LinkButton.svelte";
	import { titlePrefix } from "$lib";
	import { getUserReadableSpeciesName } from "$lib/pets/index.js";
	const { data } = $props();
	const { recentPets, userData } = data;

	function getRandomImageUUID(uuids: string[] | undefined): string | null {
		if (!uuids || uuids.length === 0) return null;
		const idx = Math.floor(Math.random() * uuids.length);
		return uuids[idx];
	}
</script>

<svelte:head>
	<title>{titlePrefix}Mascotas</title>
</svelte:head>

<h1>Mascotas</h1>

<div class="pet-cards">
	{#each recentPets as pet (pet.id)}
		<div class="pet-card">
			{#if pet.attachmentUUIDs && pet.attachmentUUIDs.length > 0}
				<img
					class="pet-image"
					src={`/mascotas/imágenes/${getRandomImageUUID(pet.attachmentUUIDs)}`}
					alt={`Imagen de ${pet.name}`}
				/>
			{/if}
			<a class="pet-name" href={`/mascotas/ver/${pet.id}`}> {pet.name} </a>
			<div class="pet-meta">
				<span class="pet-author">por {pet.authorName}</span>
			</div>
			<div class="pet-description">{pet.description}</div>
			{#if pet.birthDate}
				<div class="pet-detail">
					<span class="bold"
						>{Math.floor(
							(Date.now() / 1000 - pet.birthDate) / (365.25 * 24 * 60 * 60),
						)}</span
					> años de edad
				</div>
			{/if}
			<div class="pet-detail">
				{getUserReadableSpeciesName(pet.species)}
			</div>
		</div>
	{/each}
</div>

{#if userData}
	<LinkButton href="/mascotas/crear">Crear nueva mascota</LinkButton>
{:else}
	<LinkButton href="/iniciar-sesión"
		>Iniciar sesión para registrar una mascota</LinkButton
	>
{/if}

<p id="recency-disclaimer">Se muestran las diez mascotas más recientes.</p>

<style>
	#recency-disclaimer {
		margin-top: 1rem;
		margin-bottom: 0;
		text-align: center;
	}

	.bold {
		font-weight: bold;
		font-size: 1.1rem;
	}

	:root {
		--accent-pink: #f8bbd0;
		--accent-pink-light: #fde4ec;
		--accent-pink-dark: #ec407a;
		--card-bg: #fff0f6;
		--card-border: #f8bbd0;
		--card-shadow: 0 2px 8px rgba(236, 64, 122, 0.08);
	}

	.pet-cards {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin: 3rem 0 5rem;
	}
	.pet-card {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 12px;
		padding: 1rem;
		width: 300px;
		box-shadow: var(--card-shadow);
		display: flex;
		flex-direction: column;
		transition:
			box-shadow 0.2s,
			border-color 0.2s;
	}
	.pet-card:hover {
		border-color: var(--accent-pink-dark);
		box-shadow: 0 4px 16px rgba(236, 64, 122, 0.15);
	}
	.pet-name {
		font-size: 1.2rem;
		font-weight: bold;
		color: var(--accent-pink-dark);
		text-decoration: none;
		margin-bottom: 0.5rem;
		transition: color 0.2s;
	}
	.pet-name:hover {
		color: #ad1457;
		text-decoration: underline;
	}
	.pet-meta {
		font-size: 0.9rem;
		color: #b26a85;
		margin-bottom: 0.5rem;
	}
	.pet-description {
		font-size: 1rem;
		color: #6d214f;
		margin-bottom: 0.5rem;
	}
	.pet-detail {
		background: var(--accent-pink-light);
		color: var(--accent-pink-dark);
		font-size: 0.95rem;
		font-weight: 500;
		border-radius: 8px;
		padding: 0.3rem 0.7rem;
		display: inline-block;
		margin-top: 0.2rem;
		margin-bottom: 0.2rem;
		box-shadow: 0 1px 4px rgba(236, 64, 122, 0.07);
	}
	.pet-image {
		display: block;
		width: 100%;
		height: 180px;
		object-fit: cover;
		border-radius: 10px;
		margin-bottom: 0.7rem;
		background: #fde4ec;
		box-shadow: 0 1px 6px rgba(236, 64, 122, 0.1);
	}
</style>
