# Stripe Integration Test Plan

## Test Environment Setup

### Prerequisites
- Stripe test keys configured in environment
- Local webhook endpoint available
- Test database with seed data

### Stripe CLI Setup
```bash
# Install Stripe CLI (if not already installed)
brew install stripe/stripe-cli/stripe

# Login to Stripe account
stripe login

# Forward webhooks to local development server
stripe listen --forward-to localhost:8080/api/webhooks/stripe
```

## Payment Intent Testing

### 1. Successful Payment Processing

**Test Case**: Create and confirm a payment intent
- [ ] Create PaymentIntent with valid amount and currency
- [ ] Verify client_secret is returned
- [ ] Confirm payment with test card `4242424242424242`
- [ ] Verify payment status updates to 'succeeded'
- [ ] Verify webhook event received and processed

**Test Data**:
```javascript
{
  amount: 1000, // $10.00
  currency: 'usd',
  customer: 'cus_test_customer',
  metadata: {
    creatorId: 'creator_123',
    fanId: 'fan_456',
    type: 'tip'
  }
}
```

### 2. Payment Requiring 3D Secure

**Test Case**: Handle payments requiring additional authentication
- [ ] Create PaymentIntent with test card `4000002500003155`
- [ ] Verify status is 'requires_action'
- [ ] Handle 3D Secure authentication flow
- [ ] Verify final payment status

### 3. Payment Failure Scenarios

**Test Cases**:
- [ ] **Insufficient Funds**: Card `4000000000000002`
- [ ] **Card Declined**: Card `4000000000000069`
- [ ] **Expired Card**: Card `4000000000000069` with past expiry
- [ ] **Invalid CVC**: Any valid card with CVC `999`

## Webhook Testing

### 1. Webhook Signature Verification

**Test Case**: Verify webhook signatures are properly validated
- [ ] Send valid webhook with correct signature
- [ ] Verify webhook is processed successfully
- [ ] Send invalid signature
- [ ] Verify webhook is rejected with 400 status

### 2. Idempotency Testing

**Test Case**: Ensure duplicate webhook events are handled correctly
- [ ] Process webhook event once
- [ ] Resend same webhook event
- [ ] Verify event is not processed twice
- [ ] Check database for duplicate records

### 3. Event Processing

**Critical Webhook Events to Test**:
- [ ] `payment_intent.succeeded`
- [ ] `payment_intent.payment_failed`
- [ ] `customer.subscription.created`
- [ ] `customer.subscription.deleted`
- [ ] `invoice.payment_succeeded`
- [ ] `invoice.payment_failed`

## Subscription Testing

### 1. Subscription Creation

**Test Case**: Create recurring subscription
- [ ] Create customer with payment method
- [ ] Create subscription with monthly billing
- [ ] Verify subscription status is 'active'
- [ ] Verify first invoice is paid

### 2. Subscription Management

**Test Cases**:
- [ ] **Update Subscription**: Change plan or quantity
- [ ] **Cancel Subscription**: Cancel at period end
- [ ] **Immediate Cancellation**: Cancel immediately
- [ ] **Reactivate Subscription**: Reactivate before period end

### 3. Failed Payment Handling

**Test Case**: Handle subscription payment failures
- [ ] Create subscription with declining card
- [ ] Verify retry attempts
- [ ] Verify subscription status updates
- [ ] Test dunning management

## Customer Management

### 1. Customer Creation

**Test Case**: Create and manage customers
- [ ] Create customer with metadata
- [ ] Attach payment method to customer
- [ ] Update customer information
- [ ] Delete customer

### 2. Payment Method Management

**Test Cases**:
- [ ] **Attach Payment Method**: Link card to customer
- [ ] **Detach Payment Method**: Remove card from customer
- [ ] **Set Default Payment Method**: Update default payment
- [ ] **List Payment Methods**: Retrieve customer's cards

## Error Handling

### 1. API Error Responses

**Test Cases**:
- [ ] **Invalid API Key**: Verify 401 unauthorized
- [ ] **Malformed Request**: Verify 400 bad request
- [ ] **Not Found**: Verify 404 for non-existent resources
- [ ] **Rate Limiting**: Verify 429 rate limit exceeded

### 2. Network Error Handling

**Test Cases**:
- [ ] **Timeout Handling**: Simulate network timeouts
- [ ] **Connection Error**: Test connection failures
- [ ] **Retry Logic**: Verify automatic retries for transient errors

## Security Testing

### 1. API Key Security

**Test Cases**:
- [ ] Verify production keys are not in test environments
- [ ] Verify test keys are not in production
- [ ] Test key rotation procedures

### 2. Webhook Security

**Test Cases**:
- [ ] Verify webhook endpoint requires valid signature
- [ ] Test with malformed webhook payloads
- [ ] Verify webhook secret rotation

## Performance Testing

### 1. Load Testing

**Test Cases**:
- [ ] **Concurrent Payments**: Process multiple payments simultaneously
- [ ] **High Volume Webhooks**: Handle webhook bursts
- [ ] **Database Performance**: Monitor query performance under load

### 2. Response Time Testing

**Benchmarks**:
- [ ] Payment Intent creation: < 500ms
- [ ] Webhook processing: < 200ms
- [ ] Customer operations: < 300ms

## Integration Testing Checklist

### Pre-deployment Verification

- [ ] All test cases pass with test data
- [ ] Webhook signature verification working
- [ ] Error handling covers all scenarios
- [ ] Logging captures all payment events
- [ ] Database transactions are atomic
- [ ] Currency conversion accurate (if applicable)

### Production Readiness

- [ ] Live API keys configured correctly
- [ ] Webhook endpoints accessible from Stripe
- [ ] SSL certificates valid and current
- [ ] Rate limiting configured appropriately
- [ ] Monitoring and alerting configured
- [ ] Backup payment processing tested

## Test Automation

### Unit Tests
```bash
# Run payment processing unit tests
npm test -- --grep "payment"

# Run webhook processing tests
npm test -- --grep "webhook"

# Run subscription tests
npm test -- --grep "subscription"
```

### Integration Tests
```bash
# Run full Stripe integration test suite
npm run test:stripe

# Run with coverage reporting
npm run test:stripe -- --coverage
```

### Manual Testing Script

```bash
#!/bin/bash
# stripe-test.sh

echo "Starting Stripe integration tests..."

# Start local server
npm run dev &
SERVER_PID=$!

# Start webhook forwarding
stripe listen --forward-to localhost:8080/api/webhooks/stripe &
STRIPE_PID=$!

# Wait for services to start
sleep 5

# Run test suite
npm run test:stripe:manual

# Cleanup
kill $SERVER_PID $STRIPE_PID

echo "Stripe integration tests completed."
```

## Monitoring and Observability

### Key Metrics to Track

- [ ] **Payment Success Rate**: > 99%
- [ ] **Payment Processing Time**: < 2 seconds
- [ ] **Webhook Processing Time**: < 500ms
- [ ] **Failed Payment Rate**: < 1%
- [ ] **Chargeback Rate**: < 0.5%

### Alerts to Configure

- [ ] Payment failure spike (> 5% in 10 minutes)
- [ ] Webhook processing errors
- [ ] API error rate increase
- [ ] Response time degradation
- [ ] Subscription churn anomalies

### Logs to Capture

- [ ] All payment intent creations and updates
- [ ] All webhook events received and processed
- [ ] Failed payment attempts with error codes
- [ ] Customer and subscription lifecycle events
- [ ] Security events (invalid signatures, etc.)

## Recovery Procedures

### Payment Failure Recovery
1. Identify failed payments in Stripe dashboard
2. Check application logs for error details
3. Retry payment with corrected data
4. Update customer notification status
5. Document root cause and prevention

### Webhook Failure Recovery
1. Check webhook endpoint health
2. Verify webhook signature validation
3. Replay missed webhook events via Stripe CLI
4. Reconcile application state with Stripe
5. Update monitoring to prevent recurrence