import { text, json } from "@sveltejs/kit";

/* Some code in this file was licensed MIT by the SvelteKit contributors. The
copyright notice and permissions notice follow: */

/*
    Copyright (c) 2020 [these people](https://github.com/sveltejs/kit/graphs/contributors)

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/**
 * Returns `true` if the request contains a `content-type` header with the given type
 * @license MIT
 * @author https://github.com/sveltejs/kit/graphs/contributors
 * @file kit/packages/kit/src/utils/http.js
 */
function is_content_type(request: Request, ...types: string[]) {
	const type =
		request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
	return types.includes(type.toLowerCase());
}

/**
 * @license MIT
 * @author https://github.com/sveltejs/kit/graphs/contributors
 * @file kit/packages/kit/src/utils/http.js
 */
export function is_form_content_type(request: Request) {
	// These content types must be protected against CSRF
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/enctype
	return is_content_type(
		request,
		"application/x-www-form-urlencoded",
		"multipart/form-data",
		"text/plain",
	);
}

export async function handle({ event, resolve }) {
	const assertedOrigin = process.env.ORIGIN;

	// This section of the code is based on work licensed MIT by the SvelteKit
	// contributors.
	const request = event.request;
	const url = new URL(request.url);

	if (assertedOrigin) {
		url.protocol = new URL(assertedOrigin).protocol; // IMPORTANT!
	}

	const forbidden =
		is_form_content_type(request) &&
		(request.method === "POST" ||
			request.method === "PUT" ||
			request.method === "PATCH" ||
			request.method === "DELETE") &&
		request.headers.get("origin") !== url.origin;

	if (forbidden) {
		const csrf_error = {
			status: 403,
			body: {
				message: `Cross-site ${request.method} form submissions are forbidden`,
			},
		};
		if (request.headers.get("accept") === "application/json") {
			return json(csrf_error.body, { status: csrf_error.status });
		}
		return text(csrf_error.body.message, { status: csrf_error.status });
	}
	// The section ends here.

	if (event.url.pathname.startsWith("/custom")) {
		return new Response("custom response");
	}

	const response = await resolve(event);
	return response;
}
