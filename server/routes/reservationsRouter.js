const reservationRouter = require("express").Router();
const {
  getNearestGarages,
  createReservation,
  getAllReservations,
  getReservation,
  updateReservation,
  sendEmail,
  getReservationData
} = require("../controllers/reservationController.js");
const assignParking = require("../middleware/assignParking.js");
const checkReservation = require("../middleware/checkReservation.js");

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
  .post(checkReservation, assignParking, async (req, res) => {
    const inserted = await createReservation(req.body);
    if (inserted) {
      res.sendStatus(201);
      sendEmail(inserted[0].id);
    } else {
      res.sendStatus(500);
    }
  });

reservationRouter
  .route("/:reservation_id")
  .get(async (req, res) => {
    const data = await getReservation(+req.params.reservation_id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.sendStatus(500);
    }
  })
  .patch(async (req, res) => {
    const updated = await updateReservation({
      id: +req.params.reservation_id,
      status: req.query.status,
    });
    if (updated) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });

reservationRouter.route("/garage/:garage_id").get(async (req, res) => {
  if (!req.query.date) {
    return res.sendStatus(400);
  }
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

reservationRouter.route("/email/:id").post(async (req, res) => {
  try {
    await sendEmail(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.sendStatus(500);
  }
});

reservationRouter.route('/getReservationData/:garage_id').get(async (req, res) => {
  const list = await getReservationData(+req.params.garage_id);

  if (list) {
    res.status(200).json(list);
  } else {
    res.sendStatus(500);
  }
})

module.exports = reservationRouter;
