const Tour = require('../models/tourModel');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price!',
    });
  }
  next();
};
exports.getTours = async (req, res) => {
  // Refer: https://mongoosejs.com/docs/api/query.html
  // Sample api url: http://localhost:8000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=2500
  try {
    // Creating a copy of req.query
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // Remove all above fields from queryObject
    excludeFields.forEach((el) => delete queryObj[el]);

    // Advance filtering
    let queryStr = JSON.stringify(queryObj); //converted queryObj to string
    //replacing gte,gt,lte,lt with $gte, $gt, $lte, $lt for mongoose
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //converted queryStr to json
    let query = Tour.find(JSON.parse(queryStr));

    if (req.query.sort) {
      // if there is multiple sort in query split them and store in array.
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy); //['price','duration', etc.]
      query = query.sort(sortBy);
    } else {
      // if there is no sort in req.query then sort it by createdAt as default
      query = query.sort('-createdAt');
    }

    // FIELD LIMITING
    if (req.query.fields) {
      // Include only query fields in response. eg: name,duration,difficulty, etc
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // Exclude -v from response
      query = query.select('-__v');
    }

    // PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numberOfTours = await Tour.countDocuments();
      if (skip >= numberOfTours) {
        throw new Error('This page does not exist!');
      }
    }

    // EXECUTE QUERY
    const tours = await query;
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.createTour = async (req, res) => {
  // const newTour = new Tour({})
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    const tourToDelete = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: tourToDelete,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id});
    if (tour) {
      return res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
    }
    res.status(404).json({
      status: 'fail',
      message: 'Tour with given ID not found!',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
