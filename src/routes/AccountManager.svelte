<script lang="ts">
	import type { getUserDataByToken } from "$lib/server/auth/userData";
	import { fly } from "svelte/transition";
	let {
		userData,
	}: { userData: Awaited<ReturnType<typeof getUserDataByToken>> | null } =
		$props();

	let showDropdown = $state(false);

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	let dropdownToggle = $state();
</script>

<svelte:document
	onclick={(e) => {
		if (
			dropdownToggle instanceof HTMLButtonElement &&
			e.target instanceof Node &&
			!dropdownToggle.contains(e.target)
		) {
			showDropdown = false;
		}
	}}
/>

{#if userData}
	<div class="dropdown">
		<button
			class={["dropdown-toggle", showDropdown ? "expanded" : ""]}
			bind:this={dropdownToggle}
			tabindex="0"
			onclick={toggleDropdown}
			onkeydown={toggleDropdown}
		>
			{userData.name.trim()}
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
		font-size: 0.9rem;
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
		background-color: #ffd6e0;
		transform: scale(110%);
		transition: background-color 200ms ease;
	}
	.dropdown-toggle:hover {
		cursor: pointer;
		background-color: #ffe6ee; /* lighter pink on hover */
	}
	.dropdown-items {
		position: absolute;
		display: block;
		background-color: #fff3f3; /* pink accent background */
		padding: 0.3em;
		border-radius: 10px;
		list-style: none;
		top: 50%;
		right: 0;
		width: max-content;
		/* Pink shadow */
		box-shadow: 0 5px 15px 0 rgba(255, 179, 179, 0.18);
		border: 1px solid #ffb3b3;
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
