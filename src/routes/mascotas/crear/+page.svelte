<script lang="ts">
	import { assets } from "$app/paths";
	import { titlePrefix } from "$lib/misc";
	import { DogBreeds, Species } from "$lib/pets";

	const speciesList = Object.values(Species).filter(
		(x) => typeof x === "number",
	) as Species[];

	let approximateBirth = $state(false);
	let birthDateIsUnknown = $state(false);

	function getUserReadableSpeciesName(species: Species): string {
		switch (species) {
			case Species.Cat:
				return "Gato";
			case Species.Dog:
				return "Perro";
			case Species.Other:
				return "Otra";
		}
	}

	const breedsList = Object.values(DogBreeds).filter(
		(x) => typeof x === "number",
	);
	function getUserReadableBreedName(breed: DogBreeds): string {
		switch (breed) {
			case DogBreeds.Other:
				return "Otra raza";
			case DogBreeds.Mixed:
				return "Mestizo";
			case DogBreeds.Unknown:
				return "Ninguna especificada";
			case DogBreeds.BorderCollie:
				return "Border Collie";
			case DogBreeds.Labrador:
				return "Labrador";
			case DogBreeds.GermanShepherd:
				return "Pastor Alemán";
			case DogBreeds.GoldenRetriever:
				return "Golden Retriever";
			case DogBreeds.Bulldog:
				return "Bulldog";
			case DogBreeds.Beagle:
				return "Beagle";
			case DogBreeds.Poodle:
				return "Poodle";
			case DogBreeds.Rottweiler:
				return "Rottweiler";
			case DogBreeds.YorkshireTerrier:
				return "Yorkshire Terrier";
			case DogBreeds.Boxer:
				return "Boxer";
			case DogBreeds.Dachshund:
				return "Dachshund";
		}
	}
</script>

<svelte:head>
	<title>{titlePrefix}Registrar una nueva mascota</title>
	<meta
		name="description"
		content="Ayuda a una nueva mascota a encontrar su hogar en FureverHome."
	/>
	<link rel="stylesheet" href="{assets}/centered.css" />
</svelte:head>

<h1>Nueva mascota</h1>

<form method="POST" action="/iniciar-sesión">
	<h2>Datos básicos</h2>

	<div class="question-group">
		<label for="nombre">Nombre</label>
		<input type="text" id="nombre" name="nombre" required />
	</div>

	<div class="question-group">
		<label for="raza">Especie</label>
		<select id="raza" name="raza" required>
			{#each speciesList as species (species)}
				<option value="species[1]">{getUserReadableSpeciesName(species)}</option
				>
			{/each}
		</select>
	</div>

	<div class="question-group">
		<label for="raza">Raza</label>
		<select id="raza" name="raza" value={DogBreeds.Unknown} required>
			{#each breedsList as breed (breed)}
				<option value={breed}>{getUserReadableBreedName(breed)}</option>
			{/each}
		</select>
	</div>

	<div class="question-group">
		<label for="edad">Fecha de nacimiento</label>
		<input
			type="date"
			id="edad"
			name="edad"
			disabled={birthDateIsUnknown}
			required
		/>
		<div>
			<label for="fecha-aproximada" class={[birthDateIsUnknown ? "dimmed" : ""]}
				><input
					type="checkbox"
					id="fecha-aproximada"
					name="fecha-aproximada"
					bind:checked={approximateBirth}
					disabled={birthDateIsUnknown}
				/> Esta fecha es aproximada.</label
			>

			{#if approximateBirth}
				<div id="date-precision-control">
					<label
						for="precisión-fecha"
						class={[birthDateIsUnknown ? "dimmed" : ""]}
						>La fecha dada está dentro de un
						<select class="inline" disabled={birthDateIsUnknown}>
							<option value={30 * 24 * 60 * 60}>mes</option>
							<option value={360 * 24 * 60 * 60}>año</option>
							<option value={2 * 360 * 24 * 60 * 60}>par de años</option>
						</select> de la fecha correcta.</label
					>
				</div>
			{/if}

			<div id="date-precision-control">
				<label for="conocimiento-de-la-fecha">
					<input
						id="conocimiento-de-la-fecha"
						type="checkbox"
						bind:checked={birthDateIsUnknown}
					/> No conozco la fecha de nacimiento.
				</label>
			</div>
		</div>
	</div>

	<div class="question-group">
		<label for="descripción">Descripción</label>
		<textarea id="descripción" name="descripción" required></textarea>
	</div>

	<h2>Información opcional de salud</h2>

	<div class="question-group"></div>

	<button type="submit">Registrar</button>
</form>

<style>
	#date-precision-control {
		margin: 0.3rem 0 1rem;
	}

	.dimmed {
		opacity: 50%;
	}

	.inline {
		display: inline;
		width: min-content;
		font-size: 1rem;
		padding: 0.3rem;
		margin: 0;
	}

	div.question-group {
		margin: 0.6rem 0;
	}

	div.question-group > label {
		font-weight: 550;
	}

	h1 {
		margin-bottom: 1rem;
	}

	form {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	textarea {
		height: 15rem;
		font-size: 1.2rem;
	}

	input,
	select,
	textarea {
		display: block;
	}

	input[type="checkbox"] {
		display: inline;
		width: unset;
		margin: 0;
	}

	div {
		box-sizing: border-box;
		width: 20rem;
	}

	textarea,
	select,
	input {
		box-sizing: border-box;
		width: 20rem;
	}

	select {
		font-size: 1rem;
	}

	button {
		margin: 1.5rem auto 0;
		display: block;
	}
</style>
