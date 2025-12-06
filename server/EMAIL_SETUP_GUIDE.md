# Gmail Email Verification Setup Guide

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the steps to enable 2FA

## Step 2: Generate App Password

1. After enabling 2FA, go back to Security settings
2. Under "Signing in to Google", click on "App passwords"
3. Select "Mail" as the app
4. Select "Other (Custom name)" as the device
5. Enter "Animora" as the name
6. Click "Generate"
7. **Copy the 16-character password** (it will look like: `xxxx xxxx xxxx xxxx`)

## Step 3: Update .env File

Open `server/.env` and update these lines:

```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

Replace:
- `your-gmail-address@gmail.com` with your actual Gmail address
- `xxxx xxxx xxxx xxxx` with the app password you generated

## Step 4: Test

1. Restart your server: `npm run dev`
2. Register a new user
3. Check your email for the verification code

## Troubleshooting

### "Invalid login" error
- Make sure 2FA is enabled
- Make sure you're using the App Password, not your regular Gmail password
- Remove any spaces from the app password in .env file

### Email not received
- Check spam folder
- Make sure EMAIL_USER is correct
- Check server console for error messages

### Alternative: Use a different email service

If Gmail doesn't work, you can use:
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **AWS SES** (free tier: 62,000 emails/month)

Let me know if you need help setting up an alternative!
