const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    type: {
      type: String,
      required: [true, 'Please specify whether the item is Lost or Found'],
      enum: {
        values: ['Lost', 'Found'],
        message: '{VALUE} is not a valid item type',
      },
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Electronics', 'Documents & ID', 'Accessories', 'Books & Stationery', 'Others'],
        message: '{VALUE} is not a supported category',
      },
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the campus location where lost/found'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please specify the date'],
      default: Date.now,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=600&auto=format&fit=crop',
    },
    contactInfo: {
      type: String,
      required: [true, 'Please provide contact information'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Claimed'],
      default: 'Active',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Item', itemSchema);

