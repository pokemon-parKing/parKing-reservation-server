const geocodeRouter = require('express').Router();
const { createGeocode } = require('../lib/googleapi.js');

geocodeRouter.route('/')
  .get(async (req, res) => {
    try {
      const geocode = await createGeocode(req.query.address);
      res.status(200).json(geocode);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })

module.exports = geocodeRouter;
