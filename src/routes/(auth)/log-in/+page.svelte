<script>
	import { enhance } from "$app/forms";
</script>

<h1>Welcome back.</h1>

<p>Log in to your account.</p>

<form method="POST" action="/log-in" use:enhance>
	<label for="email">Email</label>
	<input type="email" name="email" id="email" required />

	<label for="password">Password</label>
	<input type="password" name="password" id="password" required />

	<button type="submit">Log in</button>
</form>
<p>
	Don't have an account? <a href="/sign-up">Sign up</a>
</p>
<p>
	<a href="/forgot-password">Forgot password?</a>
</p>

<style>
	h1,
	p {
		text-align: center;
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

	button {
		margin: 2rem auto 1rem;
		padding: 0.5rem 3rem;
		max-width: max-content;
	}

	form label,
	form input {
		display: block;
	}
</style>
