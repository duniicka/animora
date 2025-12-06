const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit'],
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 0
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Available', 'Pending', 'Adopted'],
    default: 'Available'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  temperament: {
    type: [String],
    default: []
  },
  health: {
    type: String,
    required: [true, 'Health information is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pet', petSchema);
