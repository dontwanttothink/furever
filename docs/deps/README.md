This file tracks the project's direct dependencies.

## Production

- `@libsql/client`: Used for database access
- `dotenv`: Used for database access
- `drizzle-orm`: Used for database access
- `argon2`: Used to hash passwords
- `@fontsource-variable/inter`: Typeface

## Development

- `eslint`: Linting

  - `@eslint/compat`: unknown
  - `@eslint/js`: unknown
  - `eslint-config-prettier`: unknown
  - `eslint-plugin-svelte`: Linting Svelte files
  - `typescript-eslint`: Linting TypeScript files
  - `jiti`: Needed to make the TypeScript-based ESLint configuration work on
    Node environments, such as certain ESLint editor extensions. It is otherwise
    unnecessary.

- `stylelint`: Linting (CSS)

  - `stylelint-config-standard`: Standard rule set, extended in
    `.stylelintrc.json`.

- `svelte`: unknown
- `svelte-check`: unknown
- `@sveltejs/adapter-cloudflare`: Building for Cloudflare Workers or Pages
- `vite`: Development server, building

- `typescript`: Code analysis
  - `typescript-svelte-plugin`: Try to add types to server files
- `globals`: unknown
- `prettier`: Formatting
  - `prettier-plugin-svelte`: Formatting Svelte files
- `rimraf`: For the `package.json` `clean` command to work cross-platform
