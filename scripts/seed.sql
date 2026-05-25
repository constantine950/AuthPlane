-- Seed roles
INSERT INTO roles (name) VALUES
  ('admin'),
  ('user'),
  ('moderator'),
  ('service')
ON CONFLICT (name) DO NOTHING;