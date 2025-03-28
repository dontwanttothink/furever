# furever

This repository contains the source code for the SvelteKit application that
powers both the back-end and the web front-end of the FureverHome project.

## Running

First, create a `.env` file as in `.env.example`.

Then, to start a development server:

```sh
bun i
bun dev
```

See the SvelteKit documentation for more information on building and previewing
the app.

## Notes

`jiti` is included as a development-only dependency to make the TypeScript-based
ESLint configuration work on Node environments, such as certain ESLint editor
extensions. It is otherwise unnecessary.
