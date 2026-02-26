# Contact Form Telegram Setup

Setup guide for sending QR Studio contact form submissions to a Telegram channel.

## Prerequisites

1. Your bot (@MilderyBot) must be added to the target Telegram channel
2. Bot must have "Post Messages" permission
3. You need the channel ID (starts with `-100`)

## Step 1: Get Channel ID

### Option A: Using @userinfobot
1. Join your channel using the invite link: https://t.me/+_efJXVvvikBmMmZh
2. Forward any message from the channel to @userinfobot
3. The bot will reply with the channel ID (e.g., `-1001234567890`)

### Option B: Using n8n
1. Create a temporary webhook in n8n
2. Add @MilderyBot to your channel
3. Send a test message
4. Check the webhook payload for `chat.id`

## Step 2: Add Bot to Channel

1. Open your Telegram channel
2. Go to Channel Info → Administrators → Add Administrator
3. Search for @MilderyBot
4. Enable only "Post Messages" permission
5. Save

## Step 3: Configure n8n

### Import Workflow

1. Go to your n8n instance: http://168.231.69.92:5678
2. Click "Add workflow"
3. Click the menu (⋯) → "Import from file"
4. Select `n8n-contact-form-telegram.json`
5. Update the channel ID in the "Send to Telegram" node

### Manual Setup

If importing doesn't work, create manually:

1. **Webhook Node**
   - Method: POST
   - Path: `contact-form`
   - Response Mode: Last Node

2. **Telegram Node**
   - Resource: Message
   - Operation: Send Message
   - Chat ID: `-100YOUR_CHANNEL_ID`
   - Text: `{{ $json.body.telegramMessage }}`
   - Parse Mode: Markdown

3. **Add Telegram Credential**
   - Go to Settings → Credentials
   - Add new: Telegram
   - Bot Token: `8557150390:AAGaLqQdrV_RvEeZK9Xk1HOH2AbziqLEzg8`

## Step 4: Activate Workflow

1. Click "Save" in n8n
2. Toggle the workflow to "Active"
3. Test by submitting the contact form

## Testing

Visit your QR Studio site and submit the contact form. You should see the message appear in your Telegram channel within seconds.

## Troubleshooting

**Bot not sending messages?**
- Verify bot is admin in the channel
- Check channel ID starts with `-100`
- Check n8n execution logs for errors

**Messages not formatted?**
- Ensure Parse Mode is set to "Markdown"
- Check that `telegramMessage` field is sent from frontend

**Channel not found?**
- Make sure you've joined the channel with the bot account
- Verify the invite link is still valid
