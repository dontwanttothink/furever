<script lang="ts">
	import { assert, unshell } from "$lib";
	import ConfirmButton from "$lib/components/ConfirmButton.svelte";
	import {
		Species,
		getUserReadableSpeciesName,
		getUserReadableSexName,
		getUserReadableBreedName,
	} from "$lib/pets";
	import { onMount } from "svelte";

	const { data } = $props();
	const { pet, userData } = data;
	const {
		name,
		description,
		author,
		species,
		sex,
		breed,
		birthDate,
		weight,
		isDewormed,
		isNeutered,
		attachmentUUIDs,
	} = pet;

	let petImagesSpace = $state();
	onMount(() => {
		if (petImagesSpace) {
			assert(petImagesSpace instanceof HTMLElement);
			petImagesSpace.scrollLeft =
				(petImagesSpace.scrollWidth - petImagesSpace.clientWidth) / 2;
		}
	});

	let confirmButton: ConfirmButton | null = $state(null);
</script>

<h1>{name}</h1>
<p class="subtitle">
	{(() => {
		if (species === Species.Dog) {
			return "Un perro";
		} else if (species === Species.Cat) {
			return "Un gato";
		} else {
			return "Una mascota";
		}
	})()} buscando su hogar en FureverHome.
</p>

<!-- TODO: Extract the carousel to a separate component -->
{#if attachmentUUIDs.length > 0}
	<div class="pet-images-space" bind:this={petImagesSpace}>
		<div class="pet-images">
			{#each attachmentUUIDs as uuid (uuid)}
				<img
					src={`/mascotas/imágenes/${uuid}`}
					alt={`Imagen de ${name}`}
					class="pet-image"
				/>
			{/each}
		</div>
	</div>
	<div id="spacer" style:height="35rem"></div>
{/if}

<p>
	La información en esta página fue provista por <span class="author-name"
		>{author.name}</span
	>, quien está buscando dar a <span class="author-name">{name}</span> en adopción.
</p>

<h2>Información general</h2>
<ul>
	<li><strong>Especie:</strong> {getUserReadableSpeciesName(species)}</li>
	<li>
		<strong>Raza:</strong>
		{getUserReadableBreedName(breed) ?? "Desconocida"}
	</li>
	<li><strong>Sexo:</strong> {getUserReadableSexName(sex)}</li>
	{#if birthDate !== null}
		<li>
			<strong>Fecha de nacimiento:</strong>
			{new Date(birthDate * 1000).toLocaleDateString("es-ES")}
		</li>
	{/if}
	{#if weight !== null}
		<li><strong>Peso:</strong> {weight} kg</li>
	{/if}
	{#if isDewormed !== null}
		<li>
			<strong>¿Desparacitado?:</strong>
			{isDewormed ? "Sí" : "No"}
		</li>
	{/if}
	{#if isNeutered !== null}
		<li>
			<strong>¿Esterilizado?:</strong>
			{isNeutered ? "Sí" : "No"}
		</li>
	{/if}
</ul>

<h2>Descripción</h2>
<blockquote>
	<p>{description}</p>
</blockquote>

{#if pet.author.userId === userData?.userId}
	<details>
		<summary>Opciones</summary>
		<ConfirmButton bind:this={confirmButton} message="Eliminar esta mascota">
			<form style:max-width="400px" action="?/delete" method="POST">
				<h2 style:margin-top="0">
					¿Confirmas que quieres eliminar esta mascota?
				</h2>

				<p>
					Esta acción no se puede deshacer. Puedes crear una nueva mascota
					después de eliminarla, pero no podrás recuperar la información de esta
					mascota.
				</p>

				<div class="horizontal-center">
					<button onclick={(e) => unshell(confirmButton).cancel(e)}
						>Conservar mascota</button
					>
					<button class="is-danger" type="submit">Eliminar</button>
				</div>
			</form>
		</ConfirmButton>
	</details>
{/if}

<svelte:head>
	<!-- Weird hack to get this to work -->
	<style>
		body {
			position: relative;
		}
	</style>
</svelte:head>

<style>
	details[open] summary {
		margin-bottom: 1em;
	}

	h1 {
		margin-bottom: 0;
	}
	.subtitle {
		text-align: center;
		font-size: 1.2rem;
		margin-top: 0;
	}
	.author-name {
		font-style: italic;
	}
	.pet-images-space {
		margin: 0;
		position: absolute;
		overflow: scroll;
		width: 100vw;
		height: 35rem;
		left: 50%;
		transform: translateX(-50%);
		scrollbar-width: thin;
		scrollbar-color: #f7b6d2 #fff0f6;
	}
	.pet-images {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		height: 100%;
		width: max-content;
		margin: 0 auto;
		padding: 0 2em;
	}

	.pet-image {
		border-radius: 2.5rem;
		box-shadow: 0 4px 16px rgba(247, 182, 210, 0.15);
		max-height: 30rem;
		object-fit: cover;
		background: #fff0f6;
		transition:
			transform 300ms,
			box-shadow 300ms;
	}

	.pet-image:hover {
		transform: scale(1.01);
		box-shadow: 0 12px 36px rgba(247, 182, 210, 0.45);
	}
</style>
