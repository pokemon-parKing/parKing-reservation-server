const valetRouter = require('express').Router();
const { getOccupiedSpots, getReservedSpots, getAvailableSpots, getReservationsList, getReservationDetails } = require('../controllers/valetReservationController.js');

valetRouter.route('/:garage_id')
  .get(async (req, res) => {
    const occupied = await getOccupiedSpots({ garage_id: req.params.garage_id, date: req.query.date });
    const reserved = await getReservedSpots({ garage_id: req.params.garage_id, date: req.query.date });
    const available = await getAvailableSpots({ garage_id: req.params.garage_id, date: req.query.date });
    if (occupied !== null && reserved !== null && available !== null) {
      res.status(200).json({ occupied, reserved, available });
    } else {
      res.sendStatus(500);
    }
  })

valetRouter.route('/list/:garage_id')
  .get(async (req, res) => {
    const data = await getReservationsList({ garage_id: req.params.garage_id, date: req.query.date });
    if (data) {
      res.status(200).json(data);
    } else {
      res.sendStatus(500);
    }
  })

valetRouter.route('/detail/:reservation_id')
  .get(async (req, res) => {
    const data = await getReservationDetails({ reservation_id: req.params.reservation_id });
    if (data) {
      res.status(200).json(data);
    } else {
      res.sendStatus(500);
    }
  })

  module.exports = valetRouter;