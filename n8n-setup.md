# QR Studio - Stripe Checkout with n8n

## Setup Instructions

### 1. Import the Workflow

1. Open n8n on your VPS: `http://168.231.69.92:5678`
2. Go to **Workflows** → **Import from File**
3. Upload `n8n-stripe-workflow.json`

### 2. Add Stripe API Credential

1. Go to **Credentials** → **Add Credential**
2. Select **Header Auth**
3. Name: `Stripe API Key`
4. Name: `Authorization`
5. Value: `Bearer YOUR_STRIPE_SECRET_KEY` (get from your Stripe Dashboard)
6. Save

### 3. Configure the Workflow

1. Open the imported workflow
2. Click on **Create Stripe Session** node
3. Select the **Stripe API Key** credential you created
4. Update the **success_url** and **cancel_url** if needed
5. Save the workflow

### 4. Activate the Workflow

1. Click **Activate** toggle in the top right
2. The webhook URLs will be generated:
   - Create session: `https://168.231.69.92:5678/webhook/create-checkout-session`
   - Stripe webhook: `https://168.231.69.92:5678/webhook/stripe-webhook`

### 5. Configure Stripe Webhook (Optional)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://168.231.69.92:5678/webhook/stripe-webhook`
3. Select events: `checkout.session.completed`
4. Copy the signing secret and add to n8n if needed

### 6. Update Frontend

The frontend is already configured to call:
```
https://168.231.69.92:5678/webhook/create-checkout-session
```

### 7. SSL/HTTPS (Recommended)

For production, you'll want HTTPS. Options:
- Use a reverse proxy (nginx/Caddy) with Let's Encrypt
- Use Cloudflare tunnel
- Use n8n's built-in SSL with certificates

## Testing

1. Open your QR Studio app
2. Create a QR code
3. Click "Download $1.99"
4. Click "Pay $1.99"
5. Should redirect to Stripe Checkout
6. After payment, redirect back to success page

## Troubleshooting

- Check n8n execution logs for errors
- Verify Stripe API key is correct
- Check webhook URL is accessible from internet
- For SSL issues, check certificate configuration