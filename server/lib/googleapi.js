require('dotenv').config();
const { Client } = require('@googlemaps/google-maps-services-js');

const google = new Client({});

// takes in an address in some form (string based is fine)
const createGeocode = (address) => {
  // uses the address object to the google maps geocode api
  // onces the results are back we return a modified version of the address that includes the lat/lng
  let addressString =  `${address.address} ${address.city}, ${address.state} ${address.zip}`;
  const query = {
    params: key: process.env.GOOGLE_KEY,
    address: addressString
  };
  google.geocode(query)
    .then(results => {
      const coord = JSON.stringify(response.data.results[0].geometry.location);
      return coord;
    })
    .catch(err => {
      console.log(err);
      return null;
    })
}

const getClosestLocation = (origin, targets) => {
  // origin is the target location for the client
  // targets are a list of address in our db
    // each share either a zipcode or city with the origin location
  // use the google api to get the distances of each target location
  // use array reduce to find and return the location thats closest
}

module.exports = google;

