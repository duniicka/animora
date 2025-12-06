# Pet Management System Guide

## Overview
Owner-lər pet əlavə edə, idarə edə və silə bilərlər. Bütün pet məlumatları MongoDB-də saxlanılır.

## Backend Structure

### 1. Pet Model (`server/models/Pet.js`)
```javascript
{
  name: String (required),
  type: 'Dog' | 'Cat' | 'Bird' | 'Rabbit' (required),
  breed: String (required),
  age: Number (required, min: 0),
  location: String (required),
  status: 'Available' | 'Pending' | 'Adopted' (default: 'Available'),
  description: String (required),
  temperament: [String],
  health: String (required),
  imageUrl: String,
  ownerId: ObjectId (ref: 'User', required),
  timestamps: true
}
```

### 2. Pet Controller (`server/controllers/petController.js`)
**Endpoints:**
- `createPet` - Yeni pet əlavə et (owner only)
- `getAllPets` - Bütün petləri gətir (public)
- `getOwnerPets` - Owner-in petlərini gətir (protected)
- `getPetById` - ID-yə görə pet gətir (public)
- `updatePet` - Pet məlumatlarını yenilə (owner/admin only)
- `deletePet` - Pet-i sil (owner/admin only)

### 3. Pet Routes (`server/routes/pets.js`)
```
POST   /api/pets                  - Create pet (protected)
GET    /api/pets/owner/my-pets    - Get owner's pets (protected)
GET    /api/pets                  - Get all pets (public)
GET    /api/pets/:id              - Get pet by ID (public)
PUT    /api/pets/:id              - Update pet (protected)
DELETE /api/pets/:id              - Delete pet (protected)
```

## Frontend Structure

### 1. Add Pet Page (`client/src/pages/Owner/AddPet.tsx`)
**Features:**
- 3 column layout (Basic Info, Media Upload, Health & Temperament)
- Real-time image preview
- Form validation
- API integration with loading states
- Success/error handling

**API Call:**
```typescript
POST http://localhost:5000/api/pets
Headers: { Authorization: Bearer <token> }
Body: {
  name, type, breed, age, location, status,
  description, temperament, health, imageUrl
}
```

### 2. My Pets Page (`client/src/pages/Owner/MyPets.tsx`)
**Features:**
- Summary statistics (Total, Available, Pending, Adopted)
- Search functionality (name, breed, type, location)
- Status filters (All, Available, Pending, Adopted)
- Pet cards with status badges
- Loading states
- Empty state handling

**API Call:**
```typescript
GET http://localhost:5000/api/pets/owner/my-pets
Headers: { Authorization: Bearer <token> }
```

## Usage Flow

### Adding a Pet:
1. Owner navigates to `/owner/add-pet`
2. Fills out the form (name, type, breed, age, location, description, health, temperament)
3. Uploads an image (optional)
4. Selects status (Available/Pending/Adopted)
5. Clicks "Finalize & Activate Listing"
6. Pet is saved to MongoDB
7. Redirected to `/owner/my-pets`

### Viewing Pets:
1. Owner navigates to `/owner/my-pets`
2. System fetches owner's pets from API
3. Displays summary statistics
4. Shows pet cards with filters and search
5. Can click "Manage Listing" to edit pet

## Security
- Only authenticated owners can add pets
- Owners can only edit/delete their own pets
- Admins can edit/delete any pet
- Public can view all pets (for adoption browsing)

## Database
- Collection: `pets`
- Database: `Animora`
- Connection: MongoDB Atlas

## Testing
1. Start server: `cd server && npm run dev`
2. Start client: `cd client && npm run dev`
3. Login as owner
4. Navigate to "Add New Pet"
5. Fill form and submit
6. Check MongoDB to verify pet is saved
7. Navigate to "My Shared Pets" to see the pet

## Next Steps
- Image upload to cloud storage (Cloudinary/AWS S3)
- Edit pet functionality
- Delete pet with confirmation
- Pet adoption requests
- Pet statistics and analytics
