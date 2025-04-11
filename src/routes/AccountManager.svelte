<script lang="ts">
	import { fly } from "svelte/transition";
	const { token } = $props();

	let showDropdown = $state(false);

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}
</script>

{#if token}
	<div class="dropdown">
		<button
			class="dropdown-toggle"
			tabindex="0"
			onclick={toggleDropdown}
			onkeydown={toggleDropdown}
		>
			{token.slice(0, 10)}…
		</button>
		{#if showDropdown}
			<ul
				class="dropdown-items"
				role="menu"
				transition:fly={{ x: 0, y: -15, duration: 250 }}
			>
				<li role="menuitem">
					<form method="POST" action="/cerrar-sesión">
						<input type="submit" value="Cerrar sesión" />
					</form>
				</li>
				<li role="menuitem"><a href="">Ajustes</a></li>
			</ul>
		{/if}
	</div>
{:else}
	<p><a href="/iniciar-sesión">Iniciar sesión</a></p>
{/if}

<style>
	p {
		text-align: center;
	}
	.dropdown {
		position: relative;
		user-select: none;
	}
	.dropdown-toggle:hover {
		cursor: pointer;
	}
	.dropdown-items {
		position: absolute;
		display: block;
		background-color: rgb(238, 238, 238);
		padding: 0.5rem;
		border-radius: 10px;
		list-style: none;
		top: 50%;
		right: 0;
		width: max-content;
		/* Shadow */
		box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);
	}

	/* Style the input type submit so that it looks like the rest of the items */
	input[type="submit"] {
		background-color: transparent;
		border: none;
		padding: 0;
		text-align: left;
		font-size: inherit;
		cursor: pointer;
	}
	input[type="submit"]:hover {
		text-decoration: underline;
	}

	button {
		background-color: unset;
		transition: unset;
		color: unset;
		padding: 0;
		margin: 0;
		transform: unset;
		text-align: center;
	}
	a,
	button {
		font-weight: 500;
	}
</style>
