# 🚀 Animora Deployment Guide

## 📋 Ön Hazırlıq

### 1. MongoDB Atlas (Pulsuz)
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)-da hesab yarat
2. Yeni cluster yarat (M0 - pulsuz tier)
3. Database User yarat (username və password)
4. Network Access-də IP whitelist-ə `0.0.0.0/0` əlavə et (hər yerdən giriş)
5. Connection string-i kopyala: `mongodb+srv://username:password@cluster.mongodb.net/Animora`

### 2. Cloudinary (Pulsuz)
1. [Cloudinary](https://cloudinary.com/users/register/free)-da hesab yarat
2. Dashboard-dan götür:
   - Cloud Name
   - API Key
   - API Secret

### 3. Gmail App Password (Email üçün)
1. Gmail-də 2-Factor Authentication aktiv et
2. [App Passwords](https://myaccount.google.com/apppasswords) səhifəsinə get
3. Yeni app password yarat
4. 16 simvollu şifrəni saxla

### 4. Google OAuth (Google ilə giriş)
1. [Google Cloud Console](https://console.cloud.google.com/)
2. Yeni project yarat
3. APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Authorized redirect URIs əlavə et:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://your-backend.railway.app/api/auth/google/callback`
6. Client ID və Client Secret saxla

---

## 🔧 Backend Deployment (Railway)

### Addım 1: Railway-də Project Yarat
1. [Railway.app](https://railway.app/)-da hesab aç (GitHub ilə)
2. "New Project" → "Deploy from GitHub repo"
3. Animora repository-ni seç
4. Root directory-ni `server` olaraq təyin et

### Addım 2: Environment Variables Əlavə Et
Railway dashboard-da Variables tab-a get və əlavə et:

```env
NODE_ENV=production
PORT=5000

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Animora

# JWT Secret (təsadüfi uzun string)
JWT_SECRET=your_super_secret_random_string_here_min_32_chars

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend.railway.app/api/auth/google/callback
CLIENT_URL=https://your-frontend.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (CORS üçün)
FRONTEND_URL=https://your-frontend.vercel.app
```

### Addım 3: Deploy
- Railway avtomatik deploy edəcək
- Deploy URL-i kopyala: `https://your-backend.railway.app`

---

## 🎨 Frontend Deployment (Vercel)

### Addım 1: Vercel-də Project Yarat
1. [Vercel](https://vercel.com/)-da hesab aç (GitHub ilə)
2. "Add New Project"
3. Animora repository-ni import et
4. Root Directory: `client` seç
5. Framework Preset: `Vite` seç

### Addım 2: Environment Variables Əlavə Et
```env
VITE_API_URL=https://your-backend.railway.app
```

### Addım 3: Build Settings
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Addım 4: Deploy
- "Deploy" düyməsinə bas
- Deploy URL-i kopyala: `https://your-frontend.vercel.app`

---

## 🔄 Google OAuth Callback URL-ləri Yenilə

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Credentials → OAuth 2.0 Client ID-ni seç
3. Authorized redirect URIs-ə əlavə et:
   ```
   https://your-backend.railway.app/api/auth/google/callback
   ```
4. Authorized JavaScript origins-ə əlavə et:
   ```
   https://your-frontend.vercel.app
   ```

---

## ✅ Test Et

1. Frontend URL-ə get: `https://your-frontend.vercel.app`
2. Register et
3. Email verification yoxla
4. Login ol
5. Pet əlavə et (şəkil upload)
6. Google ilə login test et

---

## 🐛 Troubleshooting

### CORS Error
Backend-də `server/app.js`-də CORS settings yoxla:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.vercel.app'
];
```

### MongoDB Connection Error
- MongoDB Atlas-da IP whitelist yoxla
- Connection string-də username/password düzgündür?
- Database name `Animora` yazılıb?

### Email Göndərilmir
- Gmail App Password düzgündür?
- 2FA aktiv edilib?
- EMAIL_USER və EMAIL_PASS environment variable-ları təyin edilib?

### Google OAuth İşləmir
- Callback URL düzgündür?
- Client ID və Secret düzgündür?
- Google Cloud Console-da OAuth consent screen konfiqurasiya edilib?

### Şəkillər Upload Olunmur
- Cloudinary credentials düzgündür?
- CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET təyin edilib?

---

## 📝 Qeydlər

- Railway pulsuz tier: 500 saat/ay (yetərlidir)
- Vercel pulsuz tier: Limitsiz deployment
- MongoDB Atlas pulsuz tier: 512MB storage
- Cloudinary pulsuz tier: 25GB storage, 25GB bandwidth/ay

---

## 🔐 Təhlükəsizlik

1. **.env fayllarını GitHub-a yükləmə!**
2. JWT_SECRET-i güclü et (minimum 32 simvol)
3. Production-da NODE_ENV=production təyin et
4. CORS-u yalnız öz domain-lərinə icazə ver
5. MongoDB-də güclü password istifadə et

---

## 📞 Dəstək

Problem olarsa:
- Railway logs: Railway dashboard → Deployments → Logs
- Vercel logs: Vercel dashboard → Deployments → Function Logs
- MongoDB logs: Atlas dashboard → Metrics

---

**Uğurlar! 🎉**
