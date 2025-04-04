<script lang="ts">
	import { enhance } from "$app/forms";
	import { fly } from "svelte/transition";

	const { form, actionName, action } = $props();
</script>

<form method="POST" {action} use:enhance>
	<label for="email">Email</label>
	<input type="email" name="email" id="email" required />
	<label for="password">Contraseña</label>
	<input type="password" name="password" id="password" required />
	<label for="confirm-password">Confirmar contraseña</label>
	<input
		type="password"
		name="confirm-password"
		id="confirm-password"
		required
	/>
	<div id="submit-area">
		{#if form?.error}
			<p class="error" in:fly={{ x: 0, y: -10, duration: 500 }}>
				{form.error}
			</p>
		{:else}
			<p aria-hidden="true" class="error hidden">No hay <br />errores</p>
		{/if}
		<button type="submit">{actionName}</button>
	</div>
</form>

<style>
	#email {
		margin-bottom: 1.5rem;
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
