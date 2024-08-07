// models/Data.js
import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: null
  },
  time1number: {
    type: Number,
    default: null
  },
  time2number: {
    type: Number,
    default: null
  },
  time3number: {
    type: Number,
    default: null
  },
  time4number: {
    type: Number,
    default: null
  },
});

export default mongoose.models.Data || mongoose.model('Data', DataSchema);
