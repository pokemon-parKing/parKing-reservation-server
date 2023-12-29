const { Reservations, Garages } = require('../db.js');

/*
  params are based on user's input,
  expected { lat: number, lng, number }
  (the request will convert to a string but it is converted back in the code)
*/
const getNearestGarages = async (params) => {
  const { lat, lng } = params;

  try {
    const { data, error } = await Garages
      .select()
      .filter('lat','gte',+lat-0.5)
      .filter('lat','lte',+lat+0.5)
      .filter('lng','gte',+lng-0.5)
      .filter('lng','lte',+lng+0.5)

    if (error) throw error;

    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/*
  id is given from the path and passed in here from the route
  we return the full reservation row from the database
*/
const getReservation = async (id) => {
  try {
    const { data, error } = await Reservations
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;

    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/*
  query are based on user's input,
  expected values: garage_id (string) & date (string)
  garage will be in the end point path (/reservations/:garage_id)
  date is expected from the string
  --- logic for consolidating this is handled on the route file
*/
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

/*
  PURELY FOR TESTING - to be deleted in production
*/
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

/*
  reservation values are based on user's input in the body of the request,
  expected/required {
     garage_id: number,
      time: number (0-23),
      user_id: string,
      date: string ('12-3-21')
      car_id: number,
  }
  (parking_spot_id is taken care of by the middleware, status is defaulted to reserved)
*/
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
  query contains { reservation_id, status } both strings
  reservation id is from the path query and status is from the params
  This is consolidated in the route handler and passed here to the controller
  status must be one of the following ['checked-in', 'picked-up', 'cancelled'];
*/
const updateReservation = async (query) => {
  console.log(query)
  try {
    const { data, error } = await Reservations
      .update({ status: query.status })
      .eq('id', query.reservation_id)
      .select();

    if (error) throw error;
    console.log(data);
    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = { getNearestGarages, getAllReservations,
  testAllReservations, createReservation,
  updateReservation, getReservation };