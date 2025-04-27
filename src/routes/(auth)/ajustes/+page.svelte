<script lang="ts">
	import { titlePrefix, contactEmail } from "$lib";

	const { data } = $props();
	const { userData } = data;
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
			<div>
				<p>
					Tienes derecho a eliminar tu cuenta, incluida toda la información
					asociada que esté almacenada. Por favor, contacta a <a
						href="mailto:{contactEmail}">{contactEmail}</a
					>.
				</p>
				<small
					>No es necesario dar ninguna justificación. Será posible eliminar la
					cuenta desde el navegador en el futuro próximo.</small
				>
			</div>
		</form>
	</section>
</div>

<style>
	#text-et-button {
		display: flex;
		flex-direction: row;
		gap: 1em;
		align-items: center;
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
