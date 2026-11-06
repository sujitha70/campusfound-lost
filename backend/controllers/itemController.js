const mongoose = require('mongoose');
const Item = require('../models/Item');

// @desc    Fetch all lost and found items (with filtering and search)
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { type, category, status, search } = req.query;

    const filter = {};

    // Filter by type (Lost / Found)
    if (type && ['Lost', 'Found'].includes(type)) {
      filter.type = type;
    }

    // Filter by category
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Filter by status (Default can be all or specified)
    if (status) {
      filter.status = status;
    }

    // Keyword search across title, description, location
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    const items = await Item.find(filter)
      .populate('postedBy', 'name email registrationNumber')
      .sort({ createdAt: -1 });

    return res.json(items);
  } catch (error) {
    console.error('GetItems Error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving items' });
  }
};

// @desc    Fetch single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Item ID format' });
    }

    const item = await Item.findById(req.params.id).populate(
      'postedBy',
      'name email registrationNumber'
    );

    if (!item) {
      return res.status(404).json({ message: 'Item listing not found' });
    }

    return res.json(item);
  } catch (error) {
    console.error('GetItemById Error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving item' });
  }
};

// @desc    Create a new lost or found item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { title, type, category, description, location, date, image, contactInfo } = req.body;

    if (!title || !type || !category || !description || !location || !contactInfo) {
      return res.status(400).json({ message: 'Please provide all required item fields' });
    }

    const newItem = new Item({
      title: title.trim(),
      type,
      category,
      description: description.trim(),
      location: location.trim(),
      date: date || Date.now(),
      image: image && image.trim() !== '' ? image.trim() : undefined,
      contactInfo: contactInfo.trim(),
      postedBy: req.user._id,
      status: 'Active',
    });

    const savedItem = await newItem.save();
    const populatedItem = await savedItem.populate('postedBy', 'name email registrationNumber');

    return res.status(201).json(populatedItem);
  } catch (error) {
    console.error('CreateItem Error:', error.message);
    return res.status(500).json({ message: 'Server error creating item listing: ' + error.message });
  }
};

// @desc    Update an item or toggle Claimed status
// @route   PUT /api/items/:id
// @access  Private (Owner only)
const updateItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Item ID format' });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item listing not found' });
    }

    // Check ownership
    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden: You are only authorized to modify your own listings',
      });
    }

    // Update allowed fields
    const { title, type, category, description, location, date, image, contactInfo, status } =
      req.body;

    if (title !== undefined) item.title = title.trim();
    if (type !== undefined) item.type = type;
    if (category !== undefined) item.category = category;
    if (description !== undefined) item.description = description.trim();
    if (location !== undefined) item.location = location.trim();
    if (date !== undefined) item.date = date;
    if (image !== undefined) item.image = image.trim();
    if (contactInfo !== undefined) item.contactInfo = contactInfo.trim();
    if (status !== undefined) item.status = status;

    const updatedItem = await item.save();
    const populatedItem = await updatedItem.populate('postedBy', 'name email registrationNumber');

    return res.json(populatedItem);
  } catch (error) {
    console.error('UpdateItem Error:', error.message);
    return res.status(500).json({ message: 'Server error updating item: ' + error.message });
  }
};

// @desc    Delete an item listing
// @route   DELETE /api/items/:id
// @access  Private (Owner only)
const deleteItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Item ID format' });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item listing not found' });
    }

    // Check ownership
    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden: You are only authorized to delete your own listings',
      });
    }

    await item.deleteOne();

    return res.json({ message: 'Item listing deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('DeleteItem Error:', error.message);
    return res.status(500).json({ message: 'Server error deleting item: ' + error.message });
  }
};

// @desc    Fetch items posted by the logged-in student
// @route   GET /api/items/user/me
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user._id })
      .populate('postedBy', 'name email registrationNumber')
      .sort({ createdAt: -1 });

    return res.json(items);
  } catch (error) {
    console.error('GetMyItems Error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving user listings' });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
};

