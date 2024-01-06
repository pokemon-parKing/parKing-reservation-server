require('dotenv').config();
const { Client } = require('@googlemaps/google-maps-services-js');

const google = new Client({});

// takes in an address in some form (string based is fine)
const createGeocode = (address) => {
  return new Promise((resolve, reject) => {
    // let addressString =  `${address.address} ${address.city}, ${address.state} ${address.zip}`;
    const query = {
      params: {
        key: process.env.GOOGLE_KEY,
        address
      }
    };
    google.geocode(query)
      .then(results => {
        if (results.data.status !== 'OK') {
          return reject('No results');
        }
        const coord = JSON.stringify(results.data.results[0].geometry.location);
        console.log(coord);
        return resolve(coord);
      })
  })
};

const calcDistances = (origin, data) => {
  const destinations = data.map(garage => {
    return `${garage.lat},${garage.lng}`
  })

  return new Promise((resolve, reject) => {
    const query = {
      params: {
        key: process.env.GOOGLE_KEY,
        units: 'imperial',
        origins: [origin],
        destinations
      }
    }
    google.distancematrix(query)
      .then(results => {
        const convertedMetrics = results.data.rows[0].elements.map(metrics => {
          return { distance: metrics.distance.text, duration: metrics.duration.text };
        })
        resolve(convertedMetrics);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      })
  })
}



module.exports = { createGeocode, calcDistances };