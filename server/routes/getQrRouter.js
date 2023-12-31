const getQrRouter = require('express').Router();
const { getQrCode } = require('../controllers/getQrController');

getQrRouter
  .get('/:reservationId', async (req, res) => {
    try {
      console.log('req.query.reservationId', req.params.reservationId)
      let reservationId = req.params.reservationId;
      const qrCode = await getQrCode(reservationId);
      res.contentType('image/png');
      // console.log('qrCode: ', qrCode); //uncomment to view direct link in terminal and open in browswer
      res.send(qrCode);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })

  module.exports = getQrRouter;