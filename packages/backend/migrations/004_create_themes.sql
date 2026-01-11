-- Migration: Create themes table
-- Description: VS Code theme storage with JSONB for flexibility

CREATE TYPE theme_type AS ENUM ('dark', 'light', 'highContrast');

CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  theme_type theme_type NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,

  -- VS Code theme data (stored as JSONB for flexibility)
  colors JSONB NOT NULL,
  token_colors JSONB NOT NULL,
  ui_colors JSONB NOT NULL,
  font_settings JSONB,

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  downloads_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  version VARCHAR(20) DEFAULT '1.0.0',
  parent_theme_id UUID REFERENCES themes(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  CONSTRAINT check_name_length CHECK (char_length(name) >= 3),
  CONSTRAINT check_display_name_length CHECK (char_length(display_name) >= 3),
  CONSTRAINT check_non_negative_downloads CHECK (downloads_count >= 0),
  CONSTRAINT check_non_negative_likes CHECK (likes_count >= 0),
  CONSTRAINT check_published_timestamp CHECK (
    (is_published = FALSE AND published_at IS NULL) OR
    (is_published = TRUE)
  )
);

-- Theme versions table (Pro feature)
CREATE TABLE theme_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  colors JSONB NOT NULL,
  token_colors JSONB NOT NULL,
  ui_colors JSONB NOT NULL,
  font_settings JSONB,
  change_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(theme_id, version)
);

-- Theme likes (social feature)
CREATE TABLE theme_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(theme_id, user_id)
);

-- AI feedback sessions
CREATE TABLE ai_feedback_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feedback JSONB NOT NULL,
  overall_score NUMERIC(3, 2), -- 0.00 - 1.00
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT check_score_range CHECK (overall_score >= 0 AND overall_score <= 1)
);

-- Indexes
CREATE INDEX idx_themes_user_id ON themes(user_id);
CREATE INDEX idx_themes_is_public ON themes(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_themes_is_published ON themes(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_themes_theme_type ON themes(theme_type);
CREATE INDEX idx_themes_created_at ON themes(created_at DESC);
CREATE INDEX idx_themes_downloads_count ON themes(downloads_count DESC);
CREATE INDEX idx_themes_likes_count ON themes(likes_count DESC);
CREATE INDEX idx_themes_tags ON themes USING GIN(tags);
CREATE INDEX idx_themes_colors ON themes USING GIN(colors);
CREATE INDEX idx_theme_versions_theme_id ON theme_versions(theme_id, created_at DESC);
CREATE INDEX idx_theme_likes_theme_id ON theme_likes(theme_id);
CREATE INDEX idx_theme_likes_user_id ON theme_likes(user_id);
CREATE INDEX idx_ai_feedback_theme_id ON ai_feedback_sessions(theme_id, created_at DESC);
CREATE INDEX idx_ai_feedback_user_id ON ai_feedback_sessions(user_id);

-- Apply updated_at trigger
CREATE TRIGGER update_themes_updated_at
  BEFORE UPDATE ON themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment theme likes
CREATE OR REPLACE FUNCTION increment_theme_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE themes
  SET likes_count = likes_count + 1
  WHERE id = NEW.theme_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement theme likes
CREATE OR REPLACE FUNCTION decrement_theme_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE themes
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = OLD.theme_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic like counting
CREATE TRIGGER theme_liked
  AFTER INSERT ON theme_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_theme_likes();

CREATE TRIGGER theme_unliked
  AFTER DELETE ON theme_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_theme_likes();

-- Comments
COMMENT ON TABLE themes IS 'VS Code theme storage with JSONB for color configurations';
COMMENT ON TABLE theme_versions IS 'Theme version history (Pro feature)';
COMMENT ON TABLE theme_likes IS 'User likes for public themes';
COMMENT ON TABLE ai_feedback_sessions IS 'AI analysis feedback history';
COMMENT ON COLUMN themes.colors IS 'Full VS Code color scheme (JSONB)';
COMMENT ON COLUMN themes.token_colors IS 'Syntax highlighting token colors (JSONB array)';
COMMENT ON COLUMN themes.ui_colors IS 'Custom UI color palette (JSONB)';
