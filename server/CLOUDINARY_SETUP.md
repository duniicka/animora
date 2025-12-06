# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com
2. Click "Sign Up for Free"
3. Fill in your details and create account
4. Verify your email

## Step 2: Get Your Credentials

1. After login, you'll see your Dashboard
2. Copy these 3 values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123`)

## Step 3: Add to .env File

Open `server/.env` and replace the placeholder values:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## Step 4: Restart Server

```bash
cd server
npm run dev
```

## Step 5: Test Upload

1. Go to "Add New Pet" page
2. Upload an image
3. Submit the form
4. Check Cloudinary Dashboard → Media Library
5. You should see your uploaded image in "animora-pets" folder

## Features

- ✅ Automatic image optimization
- ✅ 5MB file size limit
- ✅ Supports: JPG, PNG, GIF, WebP
- ✅ Images resized to max 800x600
- ✅ Stored in "animora-pets" folder
- ✅ Free tier: 25GB storage, 25GB bandwidth/month

## Troubleshooting

**Error: "Invalid credentials"**
- Check that you copied the correct values from Cloudinary Dashboard
- Make sure there are no extra spaces in .env file

**Error: "File too large"**
- Maximum file size is 5MB
- Compress your image before uploading

**Image not showing**
- Check browser console for errors
- Verify imageUrl is saved in MongoDB
- Check Cloudinary Media Library to confirm upload

## Free Tier Limits

- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25 credits/month
- More than enough for development and small projects!
