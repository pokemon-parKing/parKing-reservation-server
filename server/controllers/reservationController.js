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
};

const getAllReservations = async (query) => {
  const { garage_id, date } = query;
  try {
    const { data, error } = await Reservations
      .select()
      .match({ 'garage_id': garage_id, 'date': date })
      .filter('status', 'in', '("reserved","checked-in")');

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

const testAllReservations = async (garage_id) => {
  try {
    const { data, error } = await Reservations
      .select()
      .eq('garage_id', garage_id);

    if (error) throw error;

    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const createReservation = async (reservation) => {
  try {
    const { data, error } = await Reservations
      .insert(reservation)
      .select();

    if (error) throw error;

    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/*
 garage: {},
 reservations:
 {
    10-5-21: [{ reservation }],

 }
*/


module.exports = { getGarages, getAllReservations, testAllReservations, createReservation };