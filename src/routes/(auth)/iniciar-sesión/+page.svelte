<script lang="ts">
	import LoginForm from "../LoginForm.svelte";
	import { assets } from "$app/paths";

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
	<LoginForm {form} action="/iniciar-sesión"></LoginForm>
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
</style>
