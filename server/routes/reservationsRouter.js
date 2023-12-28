const reservationRouter = require("express").Router();
const {
  getNearestGarages,
  testAllReservations,
  createReservation,
  getAllReservations,
} = require("../controllers/reservationController.js");
const assignParking = require("../middleware/assignParking.js");

reservationRouter
  .route("/")
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
  });

reservationRouter.route("/test").get(async (req, res) => {
  const list = await testAllReservations(req.query.garage_id);
  if (list) {
    res.status(200).json(list);
  } else {
    res.sendStatus(500);
  }
});

reservationRouter.route("/:garage_id").get(async (req, res) => {
  const list = await getAllReservations({
    garage_id: req.params.garage_id,
    date: req.query.date,
  });
  if (list) {
    res.status(200).json(list);
  } else {
    res.sendStatus(500);
  }
});

module.exports = reservationRouter;
