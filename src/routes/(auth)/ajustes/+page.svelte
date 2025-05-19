<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { titlePrefix } from "$lib";
	import { startRegistration } from "@simplewebauthn/browser";
	import { fly } from "svelte/transition";

	const { data } = $props();
	const { userData } = $derived(data);

	let deleteAccountConfirmationDialog: HTMLDialogElement | null = $state(null);

	async function createPasskey(e: SubmitEvent) {
		e.preventDefault();

		const {
			optionsJSON,
			signatureB64,
		}: {
			optionsJSON: string;
			signatureB64: string;
		} = await (await fetch("/passkeys/registration-options")).json();

		const registrationOptions = JSON.parse(optionsJSON);
		const attestationResponse = await startRegistration({
			optionsJSON: registrationOptions.webauthn,
		});

		const {
			verified,
		}: {
			verified: boolean;
		} = await (
			await fetch("/passkeys/verify-registration", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					optionsJSON,
					attestationResponse,
					signatureB64,
				}),
			})
		).json();

		if (!verified) {
			return alert("Verification failed.");
		}
		invalidate("fh:user-passkeys");
	}
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
		<form onsubmit={createPasskey}>
			<h2>Claves de acceso</h2>
			<p>
				La clave de acceso es una forma segura de iniciar sesión sin usar una
				contraseña. Puedes usarla en lugar de tu contraseña para iniciar sesión
				en cualquier dispositivo.
			</p>

			{#if userData.passkeys.length == 0}
				<button>Crear clave de acceso</button>
			{:else}
				<div id="passkey-manager">
					<table>
						<thead>
							<tr>
								<th>Clave de acceso</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<thead>
							{#each userData.passkeys as passkey (passkey.id)}
								<tr in:fly={{ y: -10 }}>
									<td>{passkey.deviceType}</td>
									<td>{passkey.id}</td>
								</tr>
							{/each}
						</thead>
						<tfoot>
							<tr>
								<td colspan="2"
									><button class="inert linklike"
										>Crear una nueva clave de acceso</button
									></td
								>
							</tr>
						</tfoot>
					</table>
				</div>{/if}
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
				<h2 style:margin-top="0">¿Confirmas que deseas eliminar tu cuenta?</h2>
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
					<button type="submit" class="is-danger" id="confirm-button"
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

	/* I think this wrapper is a vestige */
	#passkey-manager {
		width: 100%;
		table {
			width: 100%;
			tfoot td {
				text-align: center;
			}
		}

		table button {
			display: inline;
			background: none;
			color: var(--body-text-color);
		}
	}
</style>
