const express = require('express');
const tourControllers = require('../controllers/tourControllers');

const { getTours, createTour, getTour, updateTour, deleteTour } =
  tourControllers;

const router = express.Router();

router.param('id', tourControllers.checkID);

router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
