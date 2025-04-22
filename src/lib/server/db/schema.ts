// See `docs/schema.md` for more information about how data is represented.

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
		expiresAt: int().notNull(),
	},
	(table) => [index("expires_at_idx").on(table.expiresAt)],
);

export const loginAttemptsTable = sqliteTable(
	"login_attempts",
	{
		id: int().primaryKey({ autoIncrement: true }),
		userId: int()
			.notNull()
			.references(() => usersTable.id),
		timestamp: int().notNull(),
		source: text().notNull(),
	},
	(table) => [index("userId_timestamp_idx").on(table.userId, table.timestamp)],
);

export const petsTable = sqliteTable("pets_table", {
	id: int().primaryKey({ autoIncrement: true }),
	author: int()
		.notNull()
		.references(() => usersTable.id),
	timestamp: int().notNull(),

	// exact birthdate is assumed to be a number, n, of seconds since the Unix
	// epoch such that n % birthDatePrecision = birthDate.
	birthDate: int(),
	birthDatePrecision: int(),
	// The birth date precision is meaningless and ignored if birthDate is null.

	description: text().notNull(),

	name: text().notNull(),

	sex: int().notNull(),
	isNeutered: int().notNull(), // Boolean
	isDewormed: int().notNull(), // Boolean

	weight: int(),
	breed: int().notNull(), // as given in `lib/server/pets`
	species: int().notNull(), // also as given in the pets file
});

export const petAttachments = sqliteTable(
	"pet_attachments",
	{
		id: int().primaryKey({ autoIncrement: true }),
		petId: int()
			.notNull()
			.references(() => petsTable.id),
		attachmentId: text().notNull(),
	},
	(table) => [index("attachments_petId_idx").on(table.petId)],
);

export const petVaccinations = sqliteTable(
	"pet_vaccinations",
	{
		id: int().primaryKey({ autoIncrement: true }),
		petId: int()
			.notNull()
			.references(() => petsTable.id),
		isComplete: int().notNull(), // Boolean: 0 or 1
		name: text().notNull(),
	},
	(table) => [index("vaccinations_petId_idx").on(table.petId)],
);

export const petChronicConditions = sqliteTable(
	"pet_chronic_conditions",
	{
		id: int().primaryKey({ autoIncrement: true }),
		petId: int()
			.notNull()
			.references(() => petsTable.id),
		condition: int().notNull(), // once again, as given in `lib/server/pets`
	},
	(table) => [index("conditions_petId_idx").on(table.petId)],
);
