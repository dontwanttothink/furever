// The casts in this file are needed because of subtle type differences
// between DOM-like types in Cloudflare Workers and the spec, which
// SvelteKit's type definitions want.

import { error, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params: { uuid }, platform }) => {
	if (!uuid || !platform?.env) {
		throw new TypeError();
	}

	const image = await platform.env.user_photography.get(uuid);
	if (image == null) {
		error(404);
	}

	const headers = new Headers();
	image.writeHttpMetadata(headers as unknown as Worker.Headers);
	headers.set("etag", image.httpEtag);

	return new Response(image.body as unknown as ReadableStream, {
		headers,
	});
};
