const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  value: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Point', pointSchema);