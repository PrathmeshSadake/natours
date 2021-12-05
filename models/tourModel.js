const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to Mongo Database');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name.'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A Tour must have a duration.'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A Tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A Tour must have a difficulty level'],
  },
  price: { type: Number, required: [true, 'A Tour must have a price'] },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A Tour must have a image cover'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    // Exclude in api response
    select: false,
  },
  startDate: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
