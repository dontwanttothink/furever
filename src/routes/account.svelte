<script lang="ts">
	import { fly } from "svelte/transition";
	const { token } = $props();

	let showDropdown = $state(false);
</script>

{#if token}
	<div class="dropdown">
		<p
			class="dropdown-toggle"
			on:click={() => {
				showDropdown = !showDropdown;
			}}
		>
			{token.slice(0, 10)}…
		</p>
		{#if showDropdown}
			<ul
				class="dropdown-items"
				role="menu"
				transition:fly={{ x: 0, y: -10, duration: 250 }}
			>
				<li role="menuitem">
					<a href="">Cerrar sesión</a>
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
	a {
		font-weight: 500;
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
</style>
