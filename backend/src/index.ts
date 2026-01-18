import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import sql, { initDB } from "./db";

try {
  await initDB();
  console.log("Database initialized");
} catch (e) {
  console.error("Failed to initialize DB:", e);
}

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello from Bun Backend!")
  .get("/health", () => ({ status: "ok" }))

  // GET all todos
  .get("/todos", async () => {
    const result = await sql`SELECT * FROM todos ORDER BY created_at DESC`;
    return [...result];
  })

  // GET todo by id
  .get("/todos/:id", async ({ params: { id } }) => {
    const result = await sql`SELECT * FROM todos WHERE id = ${id}`;
    return { ...result[0] };
  })

  // POST create todo
  .post(
    "/todos",
    async ({ body }) => {
      const { title } = body;
      const result = await sql`
      INSERT INTO todos (title)
      VALUES (${title})
      RETURNING *
    `;
      return { ...result[0] };
    },
    {
      body: t.Object({
        title: t.String(),
      }),
    },
  )

  // PUT update todo (toggle completion)
  .put(
    "/todos/:id",
    async ({ params: { id }, body }) => {
      const { completed } = body;
      const result = await sql`
      UPDATE todos
      SET completed = ${completed}
      WHERE id = ${id}
      RETURNING *
    `;
      return { ...result[0] };
    },
    {
      body: t.Object({
        completed: t.Boolean(),
      }),
    },
  )

  // DELETE todo
  .delete("/todos/:id", async ({ params: { id } }) => {
    await sql`DELETE FROM todos WHERE id = ${id}`;
    return { success: true };
  })

  .listen({ hostname: "0.0.0.0", port: 3000 });

console.log(
  `🦊 Backend is running at ${app.server?.hostname}:${app.server?.port}`,
);
