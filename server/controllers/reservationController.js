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

const getAllReservations = async (garageId, date) => {
  // we figure out which garage is closest to the origin location
  // we will grab all reservations tied to this garage
  // format that data in some way and return it
  try {
    const { data, error } = await Reservations
      .select()
      .match({ 'id': garageId, date });

      if (error) throw error;

      const list = {};

      await data.forEach(reservation => {
        if (reservation.date !== date) return;

        if (list.hasOwnProperty(reservation.time)) {
          list[reservation.time]++;
        } else {
          list[reservation.time] = 1;
        };
      });

      // await data.forEach(reservation => {
      //   if (reservation.date !== date) return;

      //   if (list.hasOwnProperty(reservation.time)) {
      //     list[reservation.time].push(reservation);
      //   } else {
      //     list[reservation.time] = [reservation];
      //   };
      // })

    return await list;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const testAllReservations = async (garageId) => {
  try {
    const { data, error } = await Reservations
    .select()
    .eq('id', garageId);

    if (error) throw error;

    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const createReservation = () => {

}

/*
 garage: {},
 reservations:
 {
    10-5-21: [{ reservation }],

 }
*/


module.exports = { getGarages, getAllReservations, testAllReservations }