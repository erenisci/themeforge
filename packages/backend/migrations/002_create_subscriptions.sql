-- Migration: Create subscriptions and usage tracking tables
-- Description: SaaS billing infrastructure for ThemeForge

CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'pro');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete');

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  tier subscription_tier NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT check_period_dates CHECK (
    (current_period_start IS NULL AND current_period_end IS NULL) OR
    (current_period_start IS NOT NULL AND current_period_end IS NOT NULL AND current_period_end > current_period_start)
  )
);

-- Usage tracking table (monthly quotas)
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- First day of month (e.g., 2024-01-01)
  themes_created INTEGER DEFAULT 0,
  ai_analysis_count INTEGER DEFAULT 0,
  exports_count INTEGER DEFAULT 0,
  storage_bytes BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, month),
  CONSTRAINT check_non_negative_themes CHECK (themes_created >= 0),
  CONSTRAINT check_non_negative_ai CHECK (ai_analysis_count >= 0),
  CONSTRAINT check_non_negative_exports CHECK (exports_count >= 0),
  CONSTRAINT check_non_negative_storage CHECK (storage_bytes >= 0)
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_usage_tracking_user_month ON usage_tracking(user_id, month);
CREATE INDEX idx_usage_tracking_month ON usage_tracking(month);

-- Apply updated_at trigger
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get or create current month usage
CREATE OR REPLACE FUNCTION get_or_create_usage_tracking(p_user_id UUID)
RETURNS usage_tracking AS $$
DECLARE
  v_month DATE;
  v_usage usage_tracking;
BEGIN
  v_month := date_trunc('month', CURRENT_DATE);

  INSERT INTO usage_tracking (user_id, month)
  VALUES (p_user_id, v_month)
  ON CONFLICT (user_id, month) DO NOTHING;

  SELECT * INTO v_usage
  FROM usage_tracking
  WHERE user_id = p_user_id AND month = v_month;

  RETURN v_usage;
END;
$$ LANGUAGE plpgsql;

-- Function to increment usage counter
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_counter VARCHAR(50),
  p_amount INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
  v_month DATE;
BEGIN
  v_month := date_trunc('month', CURRENT_DATE);

  INSERT INTO usage_tracking (user_id, month)
  VALUES (p_user_id, v_month)
  ON CONFLICT (user_id, month) DO NOTHING;

  CASE p_counter
    WHEN 'themes_created' THEN
      UPDATE usage_tracking
      SET themes_created = themes_created + p_amount
      WHERE user_id = p_user_id AND month = v_month;

    WHEN 'ai_analysis_count' THEN
      UPDATE usage_tracking
      SET ai_analysis_count = ai_analysis_count + p_amount
      WHERE user_id = p_user_id AND month = v_month;

    WHEN 'exports_count' THEN
      UPDATE usage_tracking
      SET exports_count = exports_count + p_amount
      WHERE user_id = p_user_id AND month = v_month;

    ELSE
      RAISE EXCEPTION 'Invalid counter: %', p_counter;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE subscriptions IS 'Stripe subscription management for ThemeForge tiers';
COMMENT ON TABLE usage_tracking IS 'Monthly usage quotas and limits enforcement';
COMMENT ON FUNCTION get_or_create_usage_tracking IS 'Get current month usage or create if not exists';
COMMENT ON FUNCTION increment_usage IS 'Safely increment usage counters (themes, AI, exports)';
