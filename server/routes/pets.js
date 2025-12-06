const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Protected routes (require authentication) - Must come before parameterized routes
router.post('/', protect, upload.single('image'), petController.createPet);
router.get('/owner/my-pets', protect, petController.getOwnerPets);

// Public routes
router.get('/', petController.getAllPets);
router.get('/:id', petController.getPetById);

// Protected routes for update/delete
router.put('/:id', protect, upload.single('image'), petController.updatePet);
router.delete('/:id', protect, petController.deletePet);

module.exports = router;
