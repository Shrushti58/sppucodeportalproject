const mongoose = require('mongoose');

const PracticalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  codeLink: String, // GitHub link or file URL
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  }
});

module.exports = mongoose.model('Practical', PracticalSchema);
