const { Reservations, Garages, ParkingSpots } = require('../db.js');

const getOccupiedSpots = async (params) => {
  const { garage_id, date } = params;
  try {
    const { data, error } = await Reservations
      .select()
      .match({ 'garage_id': garage_id, 'status': 'checked-in' });
//might add additional filter if looking for specific date/time
    if (error) throw error;

    return await data.length;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getReservedSpots = async (params) => {
  const { garage_id, date } = params;
  try {
    const { data, error } = await Reservations
      .select()
      .match({ 'garage_id': garage_id, 'status': 'reserved' });

    if (error) throw error;

    return await data.length;
  } catch (error) {
    console.log(error);
    return null;
  }
}
//use this function in conjunction with getOccupiedSpots and getReservedSpots to calculate for the number of available spots. Ex: allSpots - (occupiedSpots + reservedSpots) = available spots
const getAvailableSpots = async (params) => {
  const { garage_id, date } = params;
  const occupied = await getOccupiedSpots(params);
  const reserved = await getReservedSpots(params);
  try {
    const { data, error } = await ParkingSpots
      .select()
      .eq('garage_id', garage_id);

    if (error) throw error;

    return await data.length - (occupied + reserved);
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  getOccupiedSpots,
  getReservedSpots,
  getAvailableSpots
}