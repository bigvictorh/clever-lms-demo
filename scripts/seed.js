const { db } = require('@vercel/postgres');
const { assignments, users } = require('../src/app/lib/demo-data.js');

async function seedAssignments(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        const createAssignmentsTable = await client.sql`
            CREATE TABLE IF NOT EXISTS assignments (
                id text,
                section_id text
            );
        `;
        console.log(`Created "assignments" table`);

        const insertedAssignments = await Promise.all(
            assignments.map(async (assignment) => {
                return client.sql`
                INSERT INTO assignments (id, section_id)
                VALUES (${assignment.id}, ${assignment.section_id})
            `;
            }),
        );
        console.log(`Seeded ${insertedAssignments.length} assignment(s)`);

        // Create users table if not exists
        const createUsersTable = await client.sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name TEXT,
                email TEXT UNIQUE,
                password TEXT NOT NULL,
                clever_id TEXT
            );
        `;
        console.log(`Created "users" table`);

        // Alter the table to add 'clever_id' if it does not exist
        const alterUsersTable = await client.sql`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS clever_id TEXT;
        `;
        console.log(`Altered "users" table to ensure "clever_id" column exists`);

        const insertedUsers = await Promise.all(
            users.map(async (user) => {
                // Check if the user with the same email already exists
                const { rows: existingUser } = await client.sql`
                    SELECT * FROM users WHERE email = ${user.email};
                `;

                if (existingUser.length === 0) {
                    // Insert only if the user does not already exist
                    return client.sql`
                    INSERT INTO users (name, email, password, clever_id)
                    VALUES (${user.name}, ${user.email}, ${user.password}, ${user.clever_id});
                    `;
                } else {
                    console.log(`User with email ${user.email} already exists. Skipping insertion.`);
                    return null; // Skip insertion for duplicate users
                }
            }),
        );
        console.log(`Seeded ${insertedUsers.filter(Boolean).length} user(s)`); // Filter out skipped users

        return {
            createAssignmentsTable,
            createUsersTable,
            alterUsersTable,
            assignments: insertedAssignments,
            users: insertedUsers.filter(Boolean), // Filter out skipped users
        };
    } catch (error) {
        console.error('Error seeding data:', error);
        throw error;
    }
}

async function main() {
    const client = await db.connect();

    await seedAssignments(client);

    await client.end();
}

main().catch((err) => {
    console.error('An error occurred while attempting to seed the database:', err);
});
