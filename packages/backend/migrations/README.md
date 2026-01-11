# Database Migrations

This directory contains PostgreSQL migration files for ThemeForge.

## Migration Files

1. **001_create_users.sql** - User authentication and sessions
2. **002_create_subscriptions.sql** - SaaS billing and usage tracking
3. **003_create_addons.sql** - Add-on purchase system
4. **004_create_themes.sql** - Theme storage and AI feedback
5. **005_seed_initial_data.sql** - Initial sample data

## Running Migrations

### Option 1: Using psql (Direct)

```bash
# Connect to your PostgreSQL database
psql postgresql://username:password@host:port/database

# Run migrations in order
\i 001_create_users.sql
\i 002_create_subscriptions.sql
\i 003_create_addons.sql
\i 004_create_themes.sql
\i 005_seed_initial_data.sql
```

### Option 2: Using pg connection string

```bash
cd packages/backend/migrations

# Set your database URL
export DATABASE_URL="postgresql://username:password@host:port/database"

# Run all migrations
for file in *.sql; do
  psql $DATABASE_URL -f $file
done
```

### Option 3: Using node-pg-migrate (Recommended for production)

```bash
cd packages/backend

# Install node-pg-migrate
npm install node-pg-migrate

# Add to package.json scripts:
# "migrate:up": "node-pg-migrate up"
# "migrate:down": "node-pg-migrate down"

npm run migrate:up
```

## Database Schema

### Core Tables

- **users** - User accounts and authentication
- **user_sessions** - JWT session tracking
- **subscriptions** - Stripe subscriptions
- **usage_tracking** - Monthly quota tracking
- **user_addon_credits** - Add-on credit balance
- **addon_purchases** - Add-on transaction history
- **payment_history** - Unified payment records
- **themes** - VS Code theme storage (JSONB)
- **theme_versions** - Version history (Pro feature)
- **theme_likes** - User likes
- **ai_feedback_sessions** - AI analysis history

### Key Functions

- `get_or_create_usage_tracking(user_id)` - Get current month usage
- `increment_usage(user_id, counter, amount)` - Increment usage counters
- `get_addon_balance(user_id)` - Get add-on credit balance
- `add_addon_credits(user_id, credits)` - Add credits after purchase
- `deduct_addon_credits(user_id, credits)` - Deduct credits when using AI

### Enums

- `user_role`: user, premium, admin
- `subscription_tier`: free, starter, pro
- `subscription_status`: active, canceled, past_due, trialing, incomplete
- `addon_type`: ai_credits
- `addon_purchase_status`: succeeded, failed, refunded
- `payment_type`: subscription, addon
- `theme_type`: dark, light, highContrast

## Testing Migrations

After running migrations, test with:

```sql
-- Check tables created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;

-- Check functions
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' ORDER BY routine_name;

-- Test usage tracking
SELECT get_or_create_usage_tracking('00000000-0000-0000-0000-000000000000');

-- Test add-on credits
SELECT get_addon_balance('00000000-0000-0000-0000-000000000000');
```

## Rollback

To rollback all migrations:

```sql
DROP TABLE IF EXISTS ai_feedback_sessions CASCADE;
DROP TABLE IF EXISTS theme_likes CASCADE;
DROP TABLE IF EXISTS theme_versions CASCADE;
DROP TABLE IF EXISTS themes CASCADE;
DROP TABLE IF EXISTS payment_history CASCADE;
DROP TABLE IF EXISTS addon_purchases CASCADE;
DROP TABLE IF EXISTS user_addon_credits CASCADE;
DROP TABLE IF EXISTS usage_tracking CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS theme_type CASCADE;
DROP TYPE IF EXISTS payment_type CASCADE;
DROP TYPE IF EXISTS addon_purchase_status CASCADE;
DROP TYPE IF EXISTS addon_type CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS subscription_tier CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS get_or_create_usage_tracking CASCADE;
DROP FUNCTION IF EXISTS increment_usage CASCADE;
DROP FUNCTION IF EXISTS get_addon_balance CASCADE;
DROP FUNCTION IF EXISTS add_addon_credits CASCADE;
DROP FUNCTION IF EXISTS deduct_addon_credits CASCADE;
DROP FUNCTION IF EXISTS increment_theme_likes CASCADE;
DROP FUNCTION IF EXISTS decrement_theme_likes CASCADE;
```

## Notes

- All timestamps use `TIMESTAMPTZ` (timezone-aware)
- Foreign keys have `ON DELETE CASCADE` for data cleanup
- Indexes created for common queries
- JSONB used for flexible theme configurations
- Constraints enforce data integrity
- Functions provide safe usage tracking
