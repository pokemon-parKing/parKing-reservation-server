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

const getClosestLocation = (origin, targets) => {
  // origin is the target location for the client
  // targets are a list of address in our db
    // each share either a zipcode or city with the origin location
  // use the google api to get the distances of each target location
  // use array reduce to find and return the location thats closest
}

module.exports = { createGeocode };