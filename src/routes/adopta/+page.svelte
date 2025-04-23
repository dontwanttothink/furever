<script>
	const { data } = $props();
	const { userData } = data;
</script>

<h1>Formulario de Adopción</h1>

{#if userData}
	<!-- Show the form if the user is logged in -->
	<form>
		<!-- Your form fields here -->
		<label>
			Nombre:
			<input type="text" name="name" />
		</label>
		<br />
		<label>
			¿Qué tipo de mascota deseas adoptar?
			<select name="tipo">
				<option value="perro">Perro</option>
				<option value="gato">Gato</option>
			</select>
		</label>
		<br />
		<button type="submit">Enviar</button>
	</form>
{:else}
	<!-- Show message if user is not logged in -->
	<p><strong>Inicia sesión para llenar este formulario.</strong></p>
{/if}
