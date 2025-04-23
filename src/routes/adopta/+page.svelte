<script>
	import { assets } from "$app/paths";
	import { titlePrefix } from "$lib";

	const { data } = $props();
	const { userData } = data;
</script>

<svelte:head>
	<title>{titlePrefix}Formulario de Adopción</title>
	<meta
		name="description"
		content="Ayuda a una nueva mascota a encontrar su hogar llenando un formulario de adopción."
	/>
	<link rel="stylesheet" href="{assets}/centered.css" />
</svelte:head>

<div>
	<h1>Formulario de Adopción</h1>

	{#if userData}
		<!-- Show the form if the user is logged in -->
		<form>
			<!-- Your form fields here -->
			<h2>Información de contacto</h2>
			<br />
			<label>
				Nombre:
				<br /><input type="text" name="name" /><br />
			</label>
			<br />
			<label>
				Correo electrónico:
				<br /> <input id="email" name="email" type="email" required /> <br />
			</label>
			<br />
			<label for="id">Número de identificación:</label><br />
			<input id="id" name="id" type="text" required /><br />
			<label>
				Ocupación:
				<br /><input type="text" name="ocupacion" /><br />
			</label>
			<br />
			<label for="ingresos">Ingresos mensuales aproximados:</label><br />
			<input
				id="ingresos"
				name="ingresos"
				type="number"
				min="1423500"
				step="100"
			/><br />
			<label for="empresa">Empresa donde trabaja:</label><br />
			<input id="empresa" name="empresa" type="text" /><br />
			<label for="telefono">Teléfono:</label><br />
			<input id="telefono" name="telefono" type="tel" /><br />
			<label for="tipo_vivienda">Tipo de vivienda:</label>
			<br />
			{#each ["Casa", "Apto", "Condominio", "Finca", "Hacienda", "Otro"] as tipo (tipo)}
				<label>
					<input type="radio" name="tipo_vivienda" value={tipo} required />
					{tipo}
				</label>
			{/each}
			<input
				name="tipo_vivienda_otro"
				type="text"
				placeholder="¿Otro? ¿Cuál?"
			/><br />

			<label for="tenencia">La vivienda es:</label><br />
			{#each ["Propia", "Familiar", "Alquiler"] as tipo, idx (tipo)}
				<label>
					<input
						type="radio"
						name="tenencia"
						value={tipo}
						required
						id={"tenencia_" + idx}
					/>
					{tipo}
				</label>
			{/each}
			<fieldset>
				<legend>
					*En caso de ser arrendador, ¿El dueño del inmueble tiene conocimiento
					de la posible adopción y dio autorización para llevarla a cabo?
				</legend>
				<label for="autorizacion_si">
					<input
						id="autorizacion_si"
						type="radio"
						name="autorizacion"
						value="si"
						required
					/> Sí
				</label>
				<label for="autorizacion_no">
					<input
						id="autorizacion_no"
						type="radio"
						name="autorizacion"
						value="no"
					/> No
				</label>
			</fieldset>
			<br />
			<h2>Sobre ti y tu futura mascota</h2>
			<br />
			<label>
				¿Qué tipo de mascota deseas adoptar?
				<select name="tipo">
					<option value="perro">Perro</option>
					<option value="gato">Gato</option>
				</select>
			</label>
			<br />
			<label>
				<select name="violencia_hogar">
					<option value="Sí">Sí</option>
					<option value="No">No</option>
				</select>
			</label>
			<br />
			<label>
				¿Alguna de las personas dentro del hogar padece de enfermedades
				alérgicas o patologías a las cuales el médico tratante les ha
				recomendado no tener mascotas?
				<select name="alergia">
					<option value="Sí">Sí</option>
					<option value="No">No</option>
				</select>
			</label>
			<br />
			<label>
				¿Has tenido o tienes mascotas actualmente?
				<select name="mascota">
					<option value="Sí">Sí</option>
					<option value="No">No</option>
				</select>
			</label>
			<br />
			<label>
				¿Has investigado o leído acerca de los cuidados y recomendaciones para
				tener una mascota?
				<select name="violencia">
					<option value="Sí">Sí</option>
					<option value="No">No</option>
				</select>
				<label for="razon_adopcion"> ¿Por qué quieres adoptar? </label>
				<textarea
					id="razon_adopcion"
					name="razon_adopcion"
					rows="4"
					cols="50"
					placeholder="Escribe tu respuesta aquí..."
					required
				></textarea>
				<br />
				<label for="razon_encargado">
					¿Quién se encargaría de tu mascota si no pudieras hacerte cargo?
				</label>
				<textarea
					id="razon_encargado"
					name="razon_encargado"
					rows="4"
					cols="50"
					placeholder="Escribe tu respuesta aquí..."
					required
				></textarea>
			</label>
			<br />
			<label for="horas"
				>¿Cuántas horas a la semana puedes dedicar a tu mascota?</label
			><br />
			<input
				id="horas"
				name="horas"
				type="number"
				min="1"
				max="168"
				placeholder="Por ejemplo: 10"
				required
			/><br /><br />
			<h2>
				¿Tiene en cuenta los gastos de la mascota y está dispuesto a asumirlos?
			</h2>
			<table>
				<thead>
					<tr>
						<th>Gasto</th>
						<th>Sí</th>
						<th>No</th>
						<th>No se requiere</th>
					</tr>
				</thead>
				<tbody>
					{#each ["Veterinario", "Vacunación", "Esterilización", "Collar y placa de identificación", "Alimentación", "Insumos de aseo", "Mallas de seguridad", "Antiparasitarios (internos y externos)"] as item, i (item)}
						<tr>
							<td>{item}</td>
							{#each ["si", "no", "no-se-requiere"] as option (option)}
								<td>
									<input
										type="radio"
										name={"gasto_" + i}
										value={option}
										required
									/>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
			<button type="submit">Enviar</button>
		</form>
	{:else}
		<!-- Show message if user is not logged in -->
		<p><strong>Inicia sesión para llenar este formulario.</strong></p>
	{/if}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
