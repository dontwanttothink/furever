export async function generatePasskey(passwordInitializer: {
	origin: string;
	iconURL?: string;
	id: string;
	name: string;
}) {
	const credential = await navigator.credentials.create({
		password: passwordInitializer,
	} as CredentialCreationOptions); // TypeScript doesn't know about the password field
	return credential;
}
