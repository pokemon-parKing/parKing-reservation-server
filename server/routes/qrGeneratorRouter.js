const qrGeneratorRouter = require('express').Router();
const { Reservations } = require('../db');
const { generateAndStoreQRCode } = require('../controllers/qrGeneratorController');
const QRCode = require('qrcode');

qrGeneratorRouter
  .post('/:reservationId', async (req, res) => {

    const reservationId = req.params.reservationId;
    const urlToEndcode = req.body.yourUrl

    const success = await generateAndStoreQRCode(urlToEndcode, reservationId);

    if (success) {
      res.json({ success: true, message: 'QR code generated and stored successfully.' });
    } else {
      res.json({ success: false, message: 'Failed to generate and store QR code.' });
    }
  });

module.exports = qrGeneratorRouter;