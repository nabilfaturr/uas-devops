import postgres from "postgres";

const sql = postgres({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "todo_db",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
});

export default sql;

// Helper to init table if not exists (useful for local dev, though K8s will use init scripts)
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}
