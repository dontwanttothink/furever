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
			class={["dropdown-toggle", showDropdown ? "expanded" : ""]}
			tabindex="0"
			onclick={toggleDropdown}
			onkeydown={toggleDropdown}
		>
			{token.slice(0, 10)}…
			<!-- ^^^ FIXME -->
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
				<li role="menuitem"><a href="/ajustes">Ajustes</a></li>
			</ul>
		{/if}
	</div>
{:else}
	<p><a href="/iniciar-sesión">Iniciar sesión</a></p>
{/if}

<style>
	button {
		background-color: unset;
		transition: unset;
		color: unset;
		padding: 0;
		margin: 0;
		transform: unset;
		text-align: center;
	}

	p {
		text-align: center;
	}

	a,
	button,
	input[type="submit"] {
		font-weight: 500;
		color: unset;
	}

	li,
	input[type="submit"] {
		font-size: 0.8rem;
		margin: 0;
		padding: 0;
	}

	.dropdown {
		position: relative;
		user-select: none;
	}
	.dropdown-toggle {
		padding: 0.2rem;
		transition: background-color 150ms ease;
		transition: transform 150ms ease;
	}
	.dropdown-toggle.expanded {
		background-color: rgb(230, 230, 230);
		transform: scale(110%);
	}
	.dropdown-toggle:hover {
		cursor: pointer;
	}
	.dropdown-items {
		position: absolute;
		display: block;
		background-color: rgb(238, 238, 238);
		padding: 0.3em;
		border-radius: 10px;
		list-style: none;
		top: 50%;
		right: 0;
		width: max-content;
		/* Shadow */
		box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);
	}

	/* Style the submit input so that it looks like the rest of the items */
	input[type="submit"] {
		background-color: transparent;
		border: none;
		padding: 0;
		text-align: left;
		cursor: pointer;
	}
	input[type="submit"]:hover {
		text-decoration: underline;
	}
</style>
