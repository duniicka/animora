const Pet = require('../models/Pet');

// Create a new pet
exports.createPet = async (req, res) => {
  try {
    const { name, type, breed, age, location, status, description, temperament, health } = req.body;
    
    // Get owner ID from authenticated user
    const ownerId = req.user.id;

    // Validate that user is an owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owners can add pets'
      });
    }

    // Get image URL from uploaded file (if exists)
    const imageUrl = req.file ? req.file.path : '';

    // Parse temperament if it's a JSON string
    let parsedTemperament = [];
    if (temperament) {
      try {
        parsedTemperament = typeof temperament === 'string' ? JSON.parse(temperament) : temperament;
      } catch (e) {
        parsedTemperament = Array.isArray(temperament) ? temperament : [temperament];
      }
    }

    const newPet = new Pet({
      name,
      type,
      breed,
      age,
      location,
      status: status || 'Available',
      description,
      temperament: parsedTemperament,
      health,
      imageUrl,
      ownerId
    });

    await newPet.save();

    res.status(201).json({
      success: true,
      message: 'Pet added successfully',
      pet: newPet
    });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add pet',
      error: error.message
    });
  }
};

// Get all pets (public - for clients to browse)
exports.getAllPets = async (req, res) => {
  try {
    const { type, status, location } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (location) filter.location = new RegExp(location, 'i');

    const pets = await Pet.find(filter)
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pets.length,
      pets
    });
  } catch (error) {
    console.error('Get all pets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pets',
      error: error.message
    });
  }
};

// Get pets by owner (for owner dashboard)
exports.getOwnerPets = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const pets = await Pet.find({ ownerId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pets.length,
      pets
    });
  } catch (error) {
    console.error('Get owner pets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your pets',
      error: error.message
    });
  }
};

// Get single pet by ID
exports.getPetById = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findById(id)
      .populate('ownerId', 'name email phone address');

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    res.status(200).json({
      success: true,
      pet
    });
  } catch (error) {
    console.error('Get pet by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pet',
      error: error.message
    });
  }
};

// Update pet
exports.updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    // Find pet and verify ownership
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    if (pet.ownerId.toString() !== ownerId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this pet'
      });
    }

    // Update data
    const updateData = { ...req.body };
    
    // Parse temperament if it's a JSON string
    if (updateData.temperament) {
      try {
        updateData.temperament = typeof updateData.temperament === 'string' 
          ? JSON.parse(updateData.temperament) 
          : updateData.temperament;
      } catch (e) {
        updateData.temperament = Array.isArray(updateData.temperament) 
          ? updateData.temperament 
          : [updateData.temperament];
      }
    }
    
    // If new image uploaded, update imageUrl
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    // Update pet
    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Pet updated successfully',
      pet: updatedPet
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pet',
      error: error.message
    });
  }
};

// Delete pet
exports.deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    // Find pet and verify ownership
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    if (pet.ownerId.toString() !== ownerId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this pet'
      });
    }

    await Pet.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Pet deleted successfully'
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pet',
      error: error.message
    });
  }
};
