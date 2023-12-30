const reservationRouter = require('express').Router();
const { getNearestGarages, testAllReservations,
  createReservation, getAllReservations, updateReservation } = require('../controllers/reservationController.js');
const { getOccupiedSpots, getReservedSpots, getAvailableSpots, getReservationsList, getReservationDetails } = require('../controllers/valetReservationController.js');
const assignParking = require('../middleware/assignParking.js');

reservationRouter.route('/')
  .get(async (req, res) => {
    const list = await getNearestGarages(req.query);
    if (list) {
      res.status(200).json(list);
    } else {
      res.sendStatus(500);
    }
  })
  .post(assignParking, async (req, res) => {
    const inserted = await createReservation(req.body);
    if (inserted) {
      res.sendStatus(201);
    } else {
      res.sendStatus(500);
    }
  })

reservationRouter.route('/:garage_id')
  .get(async (req, res) => {
    const list = await getAllReservations({ garage_id: req.params.garage_id, date: req.query.date });
    if (list) {
      res.status(200).json(list);
    } else {
      res.sendStatus(500);
    }
  })

reservationRouter.route('/:reservation_id')
  .patch(async (req, res) => {
    const updated = await updateReservation({ reservation_id: +req.params.reservation_id, status: req.query.status });
    if (updated) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500)
    }
  })

reservationRouter.route('/test')
  .get(async (req, res) => {
    const list = await testAllReservations(req.query);
    if (list) {
      res.status(200).json(list);
    } else {
      res.sendStatus(500);
    }
  })

reservationRouter.route('/valet/:garage_id')
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

reservationRouter.route('/valet/list/:garage_id')
  .get(async (req, res) => {
    const data = await getReservationsList({ garage_id: req.params.garage_id, date: req.query.date });
    if (data) {
      res.status(200).json(data);
    } else {
      res.sendStatus(500);
    }
  })

reservationRouter.route('/valet/detail/:reservation_id')
  .get(async (req, res) => {
    const data = await getReservationDetails({ reservation_id: req.params.reservation_id });
    if (data) {
      res.status(200).json(data);
    } else {
      res.sendStatus(500);
    }
  })

module.exports = reservationRouter;
