<script lang="ts">
	import { titlePrefix } from "$lib";

	const { data } = $props();
	const { userData } = data;

	let deleteAccountConfirmationDialog: HTMLDialogElement | null = $state(null);
</script>

<svelte:head>
	<title>{titlePrefix}Ajustes de cuenta</title>
</svelte:head>

<div class="settings">
	<h1>Configuración de la cuenta</h1>

	<section>
		<form action="?/name" method="POST">
			<h2>Cambiar nombre</h2>
			<p>
				El nombre que des se mostrara públicamente, incluido cuando envíes
				mensajes o registres mascotas.
			</p>
			<div id="text-et-button">
				<input
					type="text"
					id="name"
					name="name"
					placeholder={userData.name}
					required
				/>
				<button type="submit">Actualizar</button>
			</div>
		</form>
	</section>

	<section>
		<form action="?/changePassword" method="POST">
			<h2>Cambiar contraseña</h2>
			<p>
				Cambiar la contraseña no es posible todavía. Entendemos que es una
				omisión importante.
			</p>
		</form>
	</section>

	<section>
		<form action="?/deleteAccount" method="POST">
			<h2>Eliminar cuenta</h2>
			<p>
				Tienes derecho a eliminar tu cuenta, incluida toda la información
				asociada que esté almacenada. Esta acción es irreversible.
			</p>

			<button
				type="button"
				onclick={() => {
					deleteAccountConfirmationDialog?.showModal();
				}}>Eliminar…</button
			>
			<dialog bind:this={deleteAccountConfirmationDialog}>
				<h2 style:margin-top="0">
					¿Estás seguro de que deseas eliminar tu cuenta?
				</h2>
				<p>
					Se eliminarán inmediatamente todos los datos asociados a tu cuenta,
					incluidos tus mensajes, mascotas y fotos.
				</p>
				<p>
					Desafortunadamente, no podemos recuperar tu cuenta una vez que la
					hayas eliminado.
				</p>
				<div style:display="flex" style:gap="1em">
					<button
						type="button"
						id="cancel-button"
						onclick={() => deleteAccountConfirmationDialog?.close()}
						>Conservar cuenta</button
					>
					<button type="submit" id="confirm-button"
						>Eliminar cuenta permanentemente</button
					>
				</div>
			</dialog>
		</form>
	</section>
</div>

<style>
	#text-et-button {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1em;
	}

	dialog {
		max-width: 30rem;
	}

	section {
		width: fit-content;
		margin: 0 auto;
		margin-bottom: 0.6rem;

		> form {
			display: flex;
			flex-direction: column;
			align-items: center;
			max-width: 30rem;
			gap: 0;

			h2 {
				margin-bottom: 0.5rem;
			}
		}
	}
</style>
