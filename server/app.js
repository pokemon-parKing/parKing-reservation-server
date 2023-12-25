const express = require('express');
const reservationRouter = require('./routes/reservationsRouter.js');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan('dev'));

app.use('/reservations', reservationRouter);

app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`);
})