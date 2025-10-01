# Stripe Integration Setup Guide

This guide will help you set up the complete payment system for your Colombian creator platform with 20% commission structure.

## 🚀 Quick Start

### 1. Environment Variables Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 2. Required Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51... # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_51... # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Created after webhook setup
STRIPE_CLIENT_ID=ca_... # Your Connect application ID

# Application URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
```

## 📊 Database Schema Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Users table (extend existing or create)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  avatar_url VARCHAR,
  stripe_customer_id VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creators table
CREATE TABLE IF NOT EXISTS creators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  bio TEXT,
  avatar_url VARCHAR,
  banner_url VARCHAR,
  subscription_price INTEGER DEFAULT 1499, -- in cents ($14.99)
  stripe_account_id VARCHAR,
  payout_enabled BOOLEAN DEFAULT FALSE,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_subscription_id VARCHAR UNIQUE NOT NULL,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  fan_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  stripe_payment_intent_id VARCHAR,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  type VARCHAR NOT NULL, -- 'subscription', 'tip', 'payout'
  status VARCHAR NOT NULL, -- 'pending', 'completed', 'failed'
  platform_fee DECIMAL(10,2),
  processing_fee DECIMAL(10,2),
  creator_earnings DECIMAL(10,2),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator earnings table
CREATE TABLE IF NOT EXISTS creator_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  transaction_id VARCHAR NOT NULL,
  gross_amount INTEGER NOT NULL, -- in cents
  net_amount INTEGER NOT NULL, -- in cents (creator's share)
  platform_fee INTEGER NOT NULL, -- in cents
  type VARCHAR NOT NULL, -- 'subscription', 'tip'
  status VARCHAR DEFAULT 'pending', -- 'pending', 'paid'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator_id ON subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_fan_id ON subscriptions(fan_id);
CREATE INDEX IF NOT EXISTS idx_transactions_to_user_id ON transactions(to_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_from_user_id ON transactions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_creator_id ON creator_earnings(creator_id);
```

## 🔧 Stripe Account Setup

### 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create account or login
3. Enable Connect (for creator payouts)

### 2. Enable Stripe Connect

1. In Stripe Dashboard → Connect → Settings
2. Enable Express accounts (recommended for creators)
3. Configure onboarding settings
4. Set up branding and user experience

### 3. Webhook Configuration

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select these events:
   ```
   account.updated
   payment_intent.succeeded
   invoice.payment_succeeded
   customer.subscription.created
   customer.subscription.updated
   customer.subscription.deleted
   payout.paid
   ```
4. Copy the webhook secret to your `.env` file

## 💰 Commission Structure

The system automatically handles:

- **Platform Commission**: 20% of all transactions
- **Stripe Processing**: ~2.9% + $0.30 per transaction
- **Creator Earnings**: ~77% after fees

### Revenue Breakdown Example ($14.99 subscription):

- Gross Amount: $14.99
- Stripe Fee: $0.73 (2.9% + $0.30)
- Net Amount: $14.26
- Platform Fee: $2.85 (20% of net)
- Creator Earnings: $11.41 (77% total)

## 🛠 API Endpoints

### Creator Onboarding

```bash
# Start onboarding process
POST /api/creators/onboard
{
  "creatorId": "uuid",
  "email": "creator@example.com",
  "country": "CO"
}

# Check onboarding status
GET /api/creators/onboard-status/:creatorId
```

### Subscription Management

```bash
# Create subscription
POST /api/subscriptions/subscribe
{
  "creatorId": "uuid",
  "userId": "uuid",
  "paymentMethodId": "pm_..."
}

# Cancel subscription
POST /api/subscriptions/cancel
{
  "subscriptionId": "sub_...",
  "userId": "uuid"
}
```

### Tips/Donations

```bash
# Send tip
POST /api/subscriptions/tip
{
  "creatorId": "uuid",
  "userId": "uuid",
  "amount": 1000, // $10.00 in cents
  "paymentMethodId": "pm_...",
  "message": "Great content!"
}
```

### Payouts

```bash
# Request payout
POST /api/creators/payout
{
  "creatorId": "uuid",
  "amount": 5000 // $50.00 in cents (minimum $10)
}
```

### Analytics

```bash
# Creator dashboard
GET /api/creators/dashboard/:creatorId?period=30d

# Earnings history
GET /api/creators/earnings/:creatorId

# Subscription analytics
GET /api/subscriptions/analytics/:creatorId
```

## 🔒 Security Notes

1. **Webhook Verification**: All webhooks verify Stripe signatures
2. **Service Role Key**: Only use on server-side
3. **Connect Accounts**: Creators can only access their own data
4. **Minimum Amounts**: $10 minimum payout, $1 minimum tip

## 🧪 Testing

### Test Mode Setup

1. Use Stripe test keys (sk*test*...)
2. Test webhook events using Stripe CLI:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Test Cards

- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0027 6000 3184

## 🚀 Production Deployment

1. **Environment Variables**: Switch to live Stripe keys
2. **Webhook URLs**: Update to production domain
3. **Connect Settings**: Configure live onboarding flow
4. **Compliance**: Ensure PCI compliance if handling card data directly

## 📈 Scaling Considerations

- **Database Indexes**: Already included for performance
- **Webhook Reliability**: Implement retry logic if needed
- **Rate Limiting**: Consider adding rate limits to payment endpoints
- **Monitoring**: Set up alerts for failed payments/payouts

## 🆘 Troubleshooting

### Common Issues

1. **Webhook failures**: Check endpoint URL and secret
2. **Connect onboarding**: Verify redirect URLs
3. **Payout failures**: Check account capabilities
4. **Subscription errors**: Validate payment methods

### Logs

Check these endpoints for detailed logs:

- Stripe Dashboard → Webhooks → Events
- Supabase → Logs
- Application server logs

Your Colombian creator platform is now ready to process payments and scale to thousands of creators! 🚀
