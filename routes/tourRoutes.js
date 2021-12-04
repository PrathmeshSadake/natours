const express = require('express');
const tourControllers = require('../controllers/tourControllers');

const {
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
} = tourControllers;

const router = express.Router();

router.param('id', checkID);

router.route('/').get(getTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
