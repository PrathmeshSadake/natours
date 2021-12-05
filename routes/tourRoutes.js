const express = require('express');
const tourControllers = require('../controllers/tourControllers');

const { getTours, createTour, getTour, updateTour, deleteTour, checkBody } =
  tourControllers;

const router = express.Router();

router.route('/').get(getTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
