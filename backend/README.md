# Job Tracker Backend

Backend for the AI-assisted job application tracker capstone project.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in real values:
   ```
   cp .env.example .env
   ```

   - `DATABASE_URL` — a PostgreSQL connection string. For a quick local demo
     without installing Postgres, you can switch `provider` in
     `prisma/schema.prisma` to `"sqlite"` and set `DATABASE_URL="file:./dev.db"`.
   - `JWT_SECRET` — any long random string.
   - `ANTHROPIC_API_KEY` — your Anthropic API key, for the AI follow-up feature.

3. Create the database tables:
   ```
   npx prisma migrate dev --name init
   ```

4. Start the server:
   ```
   npm run dev
   ```
   The API will be available at `http://localhost:4000`.

## Routes

| Method | Route                  | Auth required | Description                     |
|--------|-------------------------|:--:|----------------------------------|
| POST   | `/auth/register`        |    | Create an account                |
| POST   | `/auth/login`           |    | Log in, returns a JWT            |
| GET    | `/applications`         | ✔  | List your applications           |
| POST   | `/applications`         | ✔  | Create an application            |
| GET    | `/applications/:id`     | ✔  | Get one application              |
| PUT    | `/applications/:id`     | ✔  | Update an application            |
| DELETE | `/applications/:id`     | ✔  | Delete an application            |
| POST   | `/ai/draft-followup`    | ✔  | Generate an AI follow-up draft   |

For protected routes, send the token from login/register as:
`Authorization: Bearer <token>`

## Next steps
- Build the frontend (React/Next.js) that consumes these routes
- Deploy: backend to Render/Railway, DB to Neon/Supabase, set the same
  environment variables there
