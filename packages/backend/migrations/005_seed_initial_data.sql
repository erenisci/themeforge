-- Migration: Seed initial data
-- Description: Default subscriptions and sample data

-- Create default free subscription for all existing users
-- (This will be handled by application logic on user registration)

-- Sample admin user (password: Admin123!)
-- Password hash generated with bcrypt rounds=12
INSERT INTO users (
  email,
  username,
  password_hash,
  full_name,
  email_verified,
  role,
  is_active
) VALUES (
  'admin@themeforge.local',
  'admin',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5JQhpXU9YUkC6', -- Admin123!
  'ThemeForge Admin',
  TRUE,
  'admin',
  TRUE
) ON CONFLICT (email) DO NOTHING;

-- Create free subscription for admin user
INSERT INTO subscriptions (
  user_id,
  stripe_customer_id,
  tier,
  status
)
SELECT
  id,
  'cus_admin_' || id,
  'free',
  'active'
FROM users
WHERE email = 'admin@themeforge.local'
ON CONFLICT (user_id) DO NOTHING;

-- Sample theme templates (can be copied by users)
INSERT INTO themes (
  user_id,
  name,
  display_name,
  description,
  theme_type,
  is_public,
  is_published,
  colors,
  token_colors,
  ui_colors,
  tags,
  version
)
SELECT
  u.id,
  'monokai-inspired',
  'Monokai Inspired',
  'A beautiful dark theme inspired by Monokai',
  'dark',
  TRUE,
  TRUE,
  '{"editor.background": "#272822", "editor.foreground": "#F8F8F2"}',
  '[{"name": "Comment", "scope": "comment", "settings": {"foreground": "#75715E"}}]',
  '{"background": "#272822", "foreground": "#F8F8F2", "accent": "#F92672", "primary": "#66D9EF", "secondary": "#A6E22E", "success": "#A6E22E", "warning": "#FD971F", "error": "#F92672", "border": "#3E3D32", "shadow": "#000000"}',
  ARRAY['dark', 'popular', 'monokai'],
  '1.0.0'
FROM users
WHERE email = 'admin@themeforge.local'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO themes (
  user_id,
  name,
  display_name,
  description,
  theme_type,
  is_public,
  is_published,
  colors,
  token_colors,
  ui_colors,
  tags,
  version
)
SELECT
  u.id,
  'solarized-light-inspired',
  'Solarized Light Inspired',
  'A clean light theme inspired by Solarized',
  'light',
  TRUE,
  TRUE,
  '{"editor.background": "#FDF6E3", "editor.foreground": "#657B83"}',
  '[{"name": "Comment", "scope": "comment", "settings": {"foreground": "#93A1A1"}}]',
  '{"background": "#FDF6E3", "foreground": "#657B83", "accent": "#268BD2", "primary": "#268BD2", "secondary": "#859900", "success": "#859900", "warning": "#B58900", "error": "#DC322F", "border": "#EEE8D5", "shadow": "#93A1A1"}',
  ARRAY['light', 'popular', 'solarized'],
  '1.0.0'
FROM users
WHERE email = 'admin@themeforge.local'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Comments
COMMENT ON TABLE themes IS 'Sample themes can be used as templates by users';
