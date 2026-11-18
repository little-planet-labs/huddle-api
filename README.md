# Huddle API

Backend for Huddle, a small team workspace app. Express 4 + PostgreSQL, Node 20.

## Running locally

```bash
npm install
createdb huddle && psql huddle -f migrations/001_init.sql
DATABASE_URL=postgres://localhost/huddle npm run build && npm start
```

Environment:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `APP_URL` | Public URL of the web app (used in emails) |
| `MAILER_URL`, `MAILER_TOKEN` | Transactional email service |

## Tests

```bash
DATABASE_URL=postgres://localhost/huddle_test npm test
```

Tests run against a real database seeded with the fixtures in `test/helpers.ts`.
