import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const usersTable = sqliteTable(
	"users_table",
	{
		id: int().primaryKey({ autoIncrement: true }),
		name: text().notNull(),
		email: text().notNull().unique(),
		passwordData: text().notNull(),
	},
	(table) => [index("email_idx").on(table.email)],
);

export const sessionsTable = sqliteTable(
	"sessions_table",
	{
		id: int().primaryKey({ autoIncrement: true }),
		userId: int()
			.notNull()
			.references(() => usersTable.id),
		token: text().notNull().unique(),
		expiresAt: int().notNull(), // seconds since unix epoch
	},
	(table) => [index("expires_at_idx").on(table.expiresAt)],
);

export const loginAttempts = sqliteTable(
	"login_attempts",
	{
		id: int().primaryKey({ autoIncrement: true }),
		userId: int()
			.notNull()
			.references(() => usersTable.id),
		timestamp: int().notNull(), // seconds since unix epoch
		source: text().notNull(),
	},
	(table) => [index("userId_timestamp_idx").on(table.userId, table.timestamp)],
);
