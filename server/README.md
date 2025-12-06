# Authentication Server

## Setup

1. Install MongoDB:
   - Download from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file:
```
PORT=5000
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/animora
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/animora
```

4. Start MongoDB (if using local):
```bash
mongod
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "client"
}
```

### POST /api/auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET /api/auth/me
Get current user (requires Bearer token in Authorization header)

## Notes
- Currently using in-memory storage. Replace with a database in production.
- Change JWT_SECRET in production to a secure random string.
