<script lang="ts">
	import { fly } from "svelte/transition";

	import { enhance } from "$app/forms";
	import { assets } from "$app/paths";
	import { assert, ExpectedUnreachableError } from "$lib";
	import { titlePrefix } from "$lib";
	import { DogBreeds, Sex, Species } from "$lib/pets";

	const { form, data } = $props();
	const { userData } = data;

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

	let uploadDialog: HTMLDialogElement | null = $state(null);

	let files: FileList | null | undefined = $state(null);
	function handleFormSubmit() {
		assert(uploadDialog);

		if (files && files.length > 0) {
			uploadDialog.showModal();
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

{#if userData}
	<div class="container">
		<form
			method="POST"
			action="crear"
			use:enhance={() => {
				assert(uploadDialog);

				uploadDialog.showModal();
				return async ({ update }) => {
					await update();
					assert(uploadDialog);
					uploadDialog.close();
				};
			}}
			enctype="multipart/form-data"
			onsubmit={handleFormSubmit}
		>
			<h2>Datos básicos</h2>

			<div class="question-group">
				<label for="nombre">Nombre</label>
				<input type="text" id="nombre" name="nombre" required />
			</div>

			<div class="question-group">
				<label for="raza">Especie</label>
				<select id="raza" name="especie" required>
					{#each speciesList as species (species)}
						<option value={species}
							>{getUserReadableSpeciesName(species)}</option
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
					<label
						for="fecha-aproximada"
						class={[birthDateIsUnknown ? "dimmed" : ""]}
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

					<div>
						<label>
							<input
								name="fecha-de-nacimiento-es-desconocida"
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

			<div class="question-group checkbox-block">
				<input
					id="fue-desparacitado"
					name="fue-desparacitado"
					type="checkbox"
				/>
				<label class="normal-weight" for="fue-desparacitado">
					La mascota fue desparacitada recientemente.
				</label>
			</div>

			<div class="question-group checkbox-block">
				<input id="fue-esterilizado" name="fue-esterilizado" type="checkbox" />
				<label class="normal-weight" for="fue-esterilizado">
					La mascota está esterilizada.
				</label>
			</div>

			<div class="question-group">
				<label for="peso">Peso en kilogramos</label>
				<input id="peso" name="peso" type="number" />
			</div>

			<h2>Imágenes</h2>

			<div class="question-group pet-images-group">
				<label for="pet-images"
					>Muestra al mundo lo tierna que es tu mascota.</label
				>
				<input
					bind:files
					type="file"
					id="pet-images"
					name="imágenes"
					accept="image/*"
					multiple
					class="pet-images-input"
				/>
				<small class="pet-images-hint">
					Puedes subir varias imágenes. Solo se aceptan archivos de imagen por
					el momento.
				</small>
			</div>

			<button type="submit">Registrar</button>
		</form>

		<dialog bind:this={uploadDialog} class="upload-dialog">
			<div class="dialog-content">
				<div class="upload-animation">
					<div class="paw"></div>
					<div class="paw"></div>
					<div class="paw"></div>
				</div>
				<h1>¡Subiendo tus imágenes!</h1>
				<p>Esto puede tardar un momento. Por favor espera.</p>
			</div>
		</dialog>

		<div id="error-area">
			{#if form?.error instanceof Array}
				<ul class="error">
					{#each form.error as e (e)}
						<li in:fly={{ x: 0, y: -10, duration: 500 }}>{e}</li>
					{/each}
				</ul>
			{:else if form?.error}
				<p class="error" in:fly={{ x: 0, y: -10, duration: 500 }}>
					{form.error}
				</p>
			{/if}
		</div>
	</div>
{:else}
	<p>
		Debes <a href="iniciar-sesión">iniciar sesión</a> para registrar una mascota.
	</p>
{/if}

<style>
	#error-area {
		min-height: 5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 0.5rem;

		ul li {
			text-align: left;
		}
	}

	.error {
		color: rgb(163, 57, 57);
		margin: 0.7rem 0;
		text-align: center;
	}

	.normal-weight {
		font-weight: normal !important;
	}

	.checkbox-block {
		display: flex;
		flex-direction: row;
		align-items: start;
		gap: 0.5rem;

		input[type="checkbox"] {
			display: block;
			margin-top: 0.32rem;
		}
	}

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

	.pet-images-group {
		margin-top: 1.2rem;
		background: #ffe4ef;
		border-radius: 1.2rem;
		padding: 1.2rem 1rem 0.7rem 1rem;
		box-shadow: 0 2px 8px 0 #f8b6d1a0;
		border: 1.5px solid #f8b6d1;
	}
	.pet-images-group label {
		color: #d16a9e;
		font-weight: 600;
		font-size: 1.1rem;
	}
	.pet-images-input {
		margin: 0.5rem auto 0.4rem;
		padding: 0.5rem;
		border-radius: 0.7rem;
		border: 1.5px solid #f8b6d1;
		background: #fff6fa;
		color: #d16a9e;
		font-size: 1rem;
		transition: border 0.2s;
		width: 100%;
	}
	.pet-images-input:focus {
		outline: none;
		border: 2px solid #d16a9e;
	}
	.pet-images-hint {
		display: block;
		margin-top: 0.3rem;
		color: #b97a9c;
		font-size: 0.95rem;
	}
	.upload-dialog {
		min-width: 22rem;
		max-width: 90vw;
		padding: 2rem 1.5rem 1.5rem 1.5rem;
		background: #fff6fa;
		border: 2.5px solid #d16a9e;
		border-radius: 1.2rem;
		box-shadow:
			0 8px 32px 0 #d16a9e40,
			0 1.5px 8px 0 #f8b6d1a0;
		z-index: 1000;
	}
	.upload-dialog[open] {
		animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
		z-index: 1000;
	}
	@keyframes popIn {
		0% {
			transform: scale(0.7) translateY(40px);
			opacity: 0;
		}
		80% {
			transform: scale(1.05) translateY(-8px);
			opacity: 1;
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}
	.upload-animation {
		display: flex;
		justify-content: center;
		gap: 0.7rem;
		margin-bottom: 1.2rem;
	}
	.paw {
		width: 2.2rem;
		height: 2.2rem;
		background: #f8b6d1;
		border-radius: 60% 60% 70% 70%;
		position: relative;
		animation: pawBounce 1.2s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
		box-shadow: 0 2px 8px #f8b6d180;
	}
	.paw:nth-child(2) {
		animation-delay: 0.2s;
		background: #ffe4ef;
	}
	.paw:nth-child(3) {
		animation-delay: 0.4s;
		background: #f8b6d1;
	}
	@keyframes pawBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-18px) scale(1.08);
		}
		60% {
			transform: translateY(0);
		}
	}
	.paw::before,
	.paw::after {
		content: "";
		position: absolute;
		background: #fff6fa;
		border-radius: 50%;
	}
	.paw::before {
		width: 0.7rem;
		height: 0.7rem;
		left: 0.2rem;
		top: -0.4rem;
	}
	.paw::after {
		width: 0.5rem;
		height: 0.5rem;
		right: 0.2rem;
		top: -0.3rem;
	}
</style>
