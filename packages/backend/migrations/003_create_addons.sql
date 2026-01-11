-- Migration: Create add-on system tables
-- Description: Pay-as-you-go AI credit purchases

CREATE TYPE addon_type AS ENUM ('ai_credits');
CREATE TYPE addon_purchase_status AS ENUM ('succeeded', 'failed', 'refunded');

-- User add-on credits balance
CREATE TABLE user_addon_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  ai_credits_addon INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT check_non_negative_credits CHECK (ai_credits_addon >= 0)
);

-- Add-on purchase history
CREATE TABLE addon_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addon_type addon_type NOT NULL,
  pack_id VARCHAR(50) NOT NULL,
  credits_purchased INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL, -- in cents
  currency VARCHAR(3) DEFAULT 'USD',
  stripe_payment_intent_id VARCHAR(255),
  status addon_purchase_status NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT check_positive_credits CHECK (credits_purchased > 0),
  CONSTRAINT check_positive_amount CHECK (amount_paid > 0),
  CONSTRAINT check_valid_pack_id CHECK (pack_id IN ('pack-10', 'pack-25', 'pack-50'))
);

-- Payment history (unified for subscriptions and add-ons)
CREATE TYPE payment_type AS ENUM ('subscription', 'addon');

CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_type payment_type NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  amount INTEGER NOT NULL, -- in cents
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL, -- succeeded, failed, refunded
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT check_positive_payment_amount CHECK (amount > 0)
);

-- Indexes
CREATE INDEX idx_addon_credits_user ON user_addon_credits(user_id);
CREATE INDEX idx_addon_purchases_user ON addon_purchases(user_id);
CREATE INDEX idx_addon_purchases_created ON addon_purchases(purchased_at DESC);
CREATE INDEX idx_addon_purchases_status ON addon_purchases(status);
CREATE INDEX idx_payment_history_user ON payment_history(user_id);
CREATE INDEX idx_payment_history_created ON payment_history(created_at DESC);
CREATE INDEX idx_payment_history_type ON payment_history(payment_type);

-- Apply updated_at trigger
CREATE TRIGGER update_user_addon_credits_updated_at
  BEFORE UPDATE ON user_addon_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get add-on credit balance
CREATE OR REPLACE FUNCTION get_addon_balance(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT COALESCE(ai_credits_addon, 0) INTO v_balance
  FROM user_addon_credits
  WHERE user_id = p_user_id;

  IF v_balance IS NULL THEN
    -- Create record if doesn't exist
    INSERT INTO user_addon_credits (user_id, ai_credits_addon)
    VALUES (p_user_id, 0)
    ON CONFLICT (user_id) DO NOTHING;
    v_balance := 0;
  END IF;

  RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

-- Function to add add-on credits
CREATE OR REPLACE FUNCTION add_addon_credits(
  p_user_id UUID,
  p_credits INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  INSERT INTO user_addon_credits (user_id, ai_credits_addon)
  VALUES (p_user_id, p_credits)
  ON CONFLICT (user_id)
  DO UPDATE SET
    ai_credits_addon = user_addon_credits.ai_credits_addon + p_credits,
    updated_at = NOW()
  RETURNING ai_credits_addon INTO v_new_balance;

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql;

-- Function to deduct add-on credits
CREATE OR REPLACE FUNCTION deduct_addon_credits(
  p_user_id UUID,
  p_credits INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  v_current_balance := get_addon_balance(p_user_id);

  IF v_current_balance < p_credits THEN
    RAISE EXCEPTION 'Insufficient add-on credits. Required: %, Available: %', p_credits, v_current_balance;
  END IF;

  UPDATE user_addon_credits
  SET
    ai_credits_addon = ai_credits_addon - p_credits,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING ai_credits_addon INTO v_new_balance;

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE user_addon_credits IS 'Persistent add-on credit balance (never expires)';
COMMENT ON TABLE addon_purchases IS 'Transaction history for add-on pack purchases';
COMMENT ON TABLE payment_history IS 'Unified payment records for subscriptions and add-ons';
COMMENT ON FUNCTION get_addon_balance IS 'Get user add-on credit balance, create if not exists';
COMMENT ON FUNCTION add_addon_credits IS 'Add credits to user balance (after purchase)';
COMMENT ON FUNCTION deduct_addon_credits IS 'Deduct credits from balance (when using AI)';
