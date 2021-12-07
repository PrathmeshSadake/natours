const mongoose = require('mongoose');
const slugify = require('slugify');

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

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name.'],
      unique: true,
      trim: true,
      maxlength: [40, 'A Tour must have a less than or equal to 40 characters'],
      minlength: [10, 'A Tour must have minimum 10 characters'],
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium or difficult',
      },
    },
    price: { type: Number, required: [true, 'A Tour must have a price'] },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Must be above 1.0'],
      max: [5, 'Must be below 5.0'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must be below regular price',
      },
    },
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
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // Exclude in api response
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// Document middleware which will run before save and onCreate.
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Regex will run for all methods starting with 'find'. eg: find, findOne, findByID
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.post(/^find/, function (doc, next) {
  next();
});

// Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
