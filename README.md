# furever

This repository contains the source code for the SvelteKit application that
powers both the back-end and the web front-end of the FureverHome project.

## Running

To start a development server:

```sh
➜ bun i
➜ cp .env,example .env

# set up the local database
➜ echo "DB_FILE_NAME=file:local.db" >> .env # saying where it should be
➜ echo "USER_CONTENT=dev_user_content" >> .env # images and so on
➜ bun drizzle-kit push # adding the schema

➜ bun -b dev
```

See the SvelteKit documentation for more information on building and previewing
the app.

Only `bun dev` is necessary in subsequent runs.

## Notes

`jiti` is included as a development-only dependency to make the TypeScript-based
ESLint configuration work on Node environments, such as certain ESLint editor
extensions. It is otherwise unnecessary.
