<script lang="ts">
	import {
		Species,
		getUserReadableSpeciesName,
		getUserReadableSexName,
		getUserReadableBreedName,
	} from "$lib/pets/index";

	const { data } = $props();
	const { pet } = data;
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
	} = pet;
</script>

<h1>{name}</h1>
<p class="subtitle">
	{(() => {
		if (species == Species.Dog) {
			return "Un perro";
		} else if (species == Species.Cat) {
			return "Un gato";
		} else {
			return "Una mascota";
		}
	})()} buscando su hogar en FureverHome.
</p>

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

<style>
	h1 {
		margin-bottom: 0rem;
	}
	.subtitle {
		text-align: center;
		font-size: 1.2rem;
		margin-top: 0;
	}
	.author-name {
		font-style: italic;
	}
</style>
