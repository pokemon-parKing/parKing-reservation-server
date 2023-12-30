const cors = require('cors');
const express = require('express');
const reservationRouter = require('./routes/reservationsRouter.js');
const geocodeRouter = require('./routes/geocodeRouter.js');
const qrGeneratorRouter = require('./routes/qrGeneratorRouter.js');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// send a query with address key (in the form of a string)
app.use('/geocode', geocodeRouter);
// /reservations -> gets you all garages that matches city/zip (need city and/or state in address object)
// /reservations/test -> gets you all the reservations (need garageId)
app.use('/reservations', reservationRouter);
app.use('/qr', qrGeneratorRouter);

app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`);
});
