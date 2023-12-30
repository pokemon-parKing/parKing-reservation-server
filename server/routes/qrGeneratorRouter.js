const qrGeneratorRouter = require('express').Router();
const { Reservations } = require('../db');
const { generateAndStoreQRCode } = require('../controllers/qrGeneratorController');
const QRCode = require('qrcode');

qrGeneratorRouter
  .post('/:reservationId', async (req, res) => {

    const reservationId = req.params.reservationId;

    const imageUrl = await generateAndStoreQRCode(reservationId);

    if (imageUrl) {
      res.json({ success: true, imageUrl });
    } else {
      res.json({ success: false, message: 'Failed to generate and store QR code.' });
    }
  });

module.exports = qrGeneratorRouter;