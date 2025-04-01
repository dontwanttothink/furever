<script lang="ts">
	import { enhance } from "$app/forms";
	import { assets } from "$app/paths";
	import { fly } from "svelte/transition";

	import { titlePrefix } from "$lib/misc";

	let { form } = $props();
</script>

<svelte:head>
	<title>{titlePrefix}Iniciar Sesión</title>
	<meta
		name="description"
		content="Inicia sesión con tu cuenta de FureverHome o crea una."
	/>

	<!-- We do this because we need to modify the 'body' and 'main' elements. We
	can't simply use :global(xxx), or the styles will persist even after the
	user navigates elsewhere. C'est fou. -->
	<link rel="stylesheet" href="{assets}/centered.css" />
</svelte:head>

<div id="wrap">
	<h1>Te damos la bienvenida de vuelta.</h1>
	<p>Inicia sesión en tu cuenta.</p>
	<form method="POST" action="/iniciar-sesión" use:enhance>
		<label for="email">Email</label>
		<input type="email" name="email" id="email" required />
		<label for="password">Contraseña</label>
		<input type="password" name="password" id="password" required />
		<div id="submit-area">
			{#if form?.error}
				<p class="error" in:fly={{ x: 0, y: -10, duration: 500 }}>
					{form.error}
				</p>
			{:else}
				<p aria-hidden="true" class="error hidden">No hay <br />errores</p>
			{/if}
			<button type="submit">Iniciar sesión</button>
		</div>
	</form>
	<p>
		¿No tienes una cuenta? <a href="/registrarse">Regístrate</a>
	</p>
	<p>
		<a href="/contraseña-olvidada">¿Olvidaste tu contraseña?</a>
	</p>
</div>

<style>
	h1 {
		text-align: center;
		max-width: 30rem;
		line-height: 1.1;
		margin: 0 0 1.5rem;
	}

	p {
		text-align: center;
	}

	.error {
		color: rgb(163, 57, 57);
	}

	.hidden {
		visibility: hidden;
	}

	form {
		display: flex;
		flex-direction: column;
		max-width: 300px;
		margin: 0 auto;
	}

	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin: 0.5rem 0;
		font-size: 1.2rem;
	}

	#submit-area {
		display: contents;
	}

	button {
		padding: 0.5rem 3rem;
		max-width: max-content;
		margin: 0 auto 0.5rem;
	}

	form label,
	form input {
		display: block;
	}
</style>
