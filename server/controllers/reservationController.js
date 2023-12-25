const { Reservations, Garages } = require('../db.js');

const getGarages = async (address) => {
  const { city, zip } = address;

  try {
    const { data, error } = await Garages
      .select()
      .or(`city.eq.${city},zip.eq.${zip}`);

    if (error) throw error;

    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getAllReservations = (garageId) => {

}


module.exports = { getGarages, getAllReservations }