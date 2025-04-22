<script lang="ts">
	import { enhance } from "$app/forms";
	import { assets } from "$app/paths";
	import { assert, ExpectedUnreachableError } from "$lib";
	import { titlePrefix } from "$lib";
	import { DogBreeds, Sex, Species } from "$lib/pets";

	const sexesList = Object.values(Sex).filter((x) => typeof x === "number");

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

	function isLeapYear(year: number) {
		return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	}
	function numberOfDaysInMonth(month: number, leapYear: boolean): number {
		assert(month >= 1 && month <= 12, "Month must be between 1 and 12");
		switch (month) {
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				return 31;
			case 4:
			case 6:
			case 9:
			case 11:
				return 30;
			case 2:
				return leapYear ? 29 : 28;
		}

		throw new ExpectedUnreachableError();
	}

	function getUserReadableSexName(sex: Sex): string {
		switch (sex) {
			case Sex.Unknown:
				return "Desconocido";
			case Sex.Male:
				return "Masculino";
			case Sex.Female:
				return "Femenino";
			case Sex.Indeterminate:
				return "Indeterminado u ambiguo";
		}
	}

	// FIXME: the client-side validation here is highkey horrible. Sigh
	let birthMonth = $state("1");
	let birthYear = $state("2020");
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

<form method="POST" action="/iniciar-sesión" use:enhance>
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
		<label>
			Sexo
			<select name="sexo">
				{#each sexesList as sex (sex)}
					<option value={sex}>{getUserReadableSexName(sex)}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="question-group">
		<label
			>Fecha de nacimiento
			<div id="date-picker" class={[birthDateIsUnknown ? "dimmed" : ""]}>
				<label
					>Día <input
						name="día-nacimiento"
						type="number"
						class="inline"
						value="1"
						min="1"
						max="31"
						onchange={(e) => {
							const userValue = parseInt(e.currentTarget.value, 10);
							const actualMax = numberOfDaysInMonth(
								parseInt(birthMonth, 10),
								isLeapYear(parseInt(birthYear, 10)),
							);

							e.currentTarget.value = Number.isNaN(userValue)
								? "1"
								: String(Math.min(actualMax, Math.max(1, userValue)));
						}}
						disabled={birthDateIsUnknown}
					/></label
				>
				<label
					>Mes <input
						name="mes-nacimiento"
						type="number"
						class="inline"
						disabled={birthDateIsUnknown}
						min="1"
						max="12"
						bind:value={birthMonth}
						onchange={(e) => {
							let userValue = parseInt(e.currentTarget.value, 10);
							e.currentTarget.value = String(
								Number.isNaN(userValue)
									? 1
									: Math.max(1, Math.min(12, userValue)),
							);
						}}
					/></label
				>
				<label
					>Año <input
						id="año-nacimiento"
						name="año-nacimiento"
						type="number"
						class="inline"
						bind:value={birthYear}
						min="1900"
						disabled={birthDateIsUnknown}
						max={new Date().getFullYear()}
					/></label
				>
			</div></label
		>

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

	<h2>Información adicional de salud</h2>
	<p>Estos datos son opcionales.</p>

	<div class="question-group"></div>

	<button type="submit">Registrar</button>
</form>

<style>
	#date-picker {
		label {
			font-weight: normal;

			input {
				width: 3.5rem;
			}
			input#año-nacimiento {
				width: 5rem;
			}
		}
	}

	h2 {
		margin-bottom: 0;
	}

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
