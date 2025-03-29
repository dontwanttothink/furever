<script>
	import { enhance } from "$app/forms";
	import { assets } from "$app/paths";
	import { fly } from "svelte/transition";

	import { titlePrefix } from "$lib/misc";

	let { form } = $props();
</script>

<svelte:head>
	<title>{titlePrefix}Log In</title>
	<meta
		name="description"
		content="This is where the description goes for SEO"
	/>

	<!-- We do this because we need to modify the 'body' and 'main' elements. We
	can't simply use :global(xxx), or the styles will persist even after the
	user navigates elsewhere. C'est fou. -->
	<link rel="stylesheet" href="{assets}/centered.css" />
</svelte:head>

<div id="wrap">
	<h1>Welcome back.</h1>
	<p>Log in to your account.</p>
	<form method="POST" action="/log-in" use:enhance>
		<label for="email">Email</label>
		<input type="email" name="email" id="email" required />
		<label for="password">Password</label>
		<input type="password" name="password" id="password" required />
		<div id="submit-area">
			{#if form?.error}
				<p class="error" in:fly={{ x: 0, y: -10, duration: 500 }}>
					{form.error}
				</p>
			{:else}
				<p aria-hidden="true" class="error hidden">No errors</p>
			{/if}
			<button type="submit">Log in</button>
		</div>
	</form>
	<p>
		Don't have an account? <a href="/sign-up">Sign up</a>
	</p>
	<p>
		<a href="/forgot-password">Forgot password?</a>
	</p>
</div>

<style>
	h1,
	p {
		text-align: center;
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
	}

	#submit-area {
		margin: 0.5rem auto 1rem;

		p.error {
			margin-top: 0;
		}
	}

	button {
		padding: 0.5rem 3rem;
		max-width: max-content;
	}

	form label,
	form input {
		display: block;
	}
</style>
