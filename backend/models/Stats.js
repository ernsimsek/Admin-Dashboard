const mongoose = require('mongoose');

// Monthly stats snapshot for charts
const statsSchema = new mongoose.Schema(
  {
    month: { type: String, required: true }, // e.g. "Jan 2024"
    year:  { type: Number, required: true },
    monthIndex: { type: Number, required: true }, // 0-11
    newUsers:   { type: Number, default: 0 },
    activeUsers:{ type: Number, default: 0 },
    sales:      { type: Number, default: 0 },  // in USD
    revenue:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stats', statsSchema);
