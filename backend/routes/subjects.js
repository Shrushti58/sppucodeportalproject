const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (err) {
    console.error('Error fetching subject:', err.message);
    res.status(500).json({ error: 'Server error' });
  }});
  
// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new subject
router.post('/', async (req, res) => {
  const { name, code, semester } = req.body;
  try {
    const newSubject = new Subject({ name, code, semester });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a subject
router.put('/:id', async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a subject
router.delete('/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
