<script lang="ts">
	import { enhance } from "$app/forms";
	import { fly } from "svelte/transition";

	const { form, action } = $props();

	let pass = $state("");
	let passConfirm = $state("");

	let confirmPasswordInput: HTMLInputElement | null = null;
	$effect(() => {
		if (!(confirmPasswordInput instanceof HTMLInputElement)) {
			throw new Error("Confirm password input not found");
		}

		if (passConfirm != pass) {
			confirmPasswordInput.setCustomValidity("Las contraseñas no coinciden.");
		} else {
			confirmPasswordInput.setCustomValidity("");
		}
	});
</script>

<form method="POST" {action} use:enhance>
	<label for="name">¿Cómo quieres que te llamen?</label>
	<input type="text" name="name" id="name" required />
	<label for="email">Email</label>
	<input type="email" name="email" id="email" required />
	<label for="password">Contraseña</label>
	<input
		type="password"
		name="password"
		id="password"
		required
		bind:value={pass}
	/>
	<label for="confirm-password">Confirmar contraseña</label>
	<input
		type="password"
		name="confirm-password"
		bind:this={confirmPasswordInput}
		bind:value={passConfirm}
		required
	/>
	<div id="submit-area">
		<div id="error-area">
			{#if form?.error}
				<p class="error" in:fly={{ x: 0, y: -10, duration: 500 }}>
					{form.error}
				</p>
			{/if}
		</div>
		<button type="submit">Registrarse</button>
	</div>
</form>

<style>
	#error-area {
		min-height: 5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 0.5rem;
	}

	.error {
		color: rgb(163, 57, 57);
		margin: 0.7rem 0;
		text-align: center;
	}

	#email {
		margin-bottom: 1.5rem;
	}
	#name {
		margin-bottom: 1.5rem;
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
