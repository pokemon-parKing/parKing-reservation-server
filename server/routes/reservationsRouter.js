const { getGarages, testAllReservations } = require('../controllers/reservationController.js');
const reservationRouter = require('express').Router();

reservationRouter.route('/')
  .get(async (req, res) => {
    console.log(req.query);
    const list = await getGarages(req.query);
    if (list) {
      res.status(200).json(list);
    } else {
      res.sendStatus(500);
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



module.exports = reservationRouter;
