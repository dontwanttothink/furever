<script lang="ts">
	import { titlePrefix } from "$lib/misc";
	import { assets } from "$app/paths";
	import SignUpForm from "../SignUpForm.svelte";

	let { form } = $props();
</script>

<svelte:head>
	<title>{titlePrefix}Registrarse</title>
	<link rel="stylesheet" href="{assets}/centered.css" />
</svelte:head>

<div id="wrap">
	<h1>Regístrate ahora.</h1>
	<SignUpForm {form} action="/registrarse" actionName="Registrarse"
	></SignUpForm>
	<p>
		¿Ya tienes una cuenta? <a href="/registrarse">Inicia sesión</a>
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
