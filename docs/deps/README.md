This file tracks the project's direct dependencies.

## Production

- `@libsql/client`: Used for database access
- `dotenv`: Used for database access
- `drizzle-orm`: Used for database access
- `argon2`: Used to hash passwords

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
- `typescript`: Code analysis
- `vite`: Development server, building
- `globals`: unknown
- `prettier`: Formatting
  - `prettier-plugin-svelte`: Formatting Svelte files
