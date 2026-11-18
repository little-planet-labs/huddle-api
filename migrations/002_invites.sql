CREATE TABLE invites (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES teams(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
