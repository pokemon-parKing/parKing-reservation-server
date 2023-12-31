const supabase = require('../db');

const getOccupiedSpots = async (params) => {
  const { garage_id, date, time } = params;
  try {
    const { data, error } = await supabase.from('reservations')
      .select()
      .match({ 'garage_id': garage_id, 'date': date, 'time': time, 'status': 'checked-in' });

    if (error) throw error;
    console.log('this is the data from occupiedSpots:', data);
    return await data.length;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getReservedSpots = async (params) => {
  const { garage_id, date, time } = params;
  try {
    const { data, error } = await supabase.from('reservations')
      .select()
      .match({ 'garage_id': garage_id, 'date': date, 'time': time, 'status': 'reserved' });

    if (error) throw error;
    console.log('this is the data from reservedSpots:', data);
    return await data.length;
  } catch (error) {
    console.log(error);
    return null;
  }
}
//use this function in conjunction with getOccupiedSpots and getReservedSpots to calculate for the number of available spots. Ex: allSpots - (occupiedSpots + reservedSpots) = available spots
const getAvailableSpots = async (params) => {
  const { garage_id, date, time } = params;
  const occupied = await getOccupiedSpots(params);
  const reserved = await getReservedSpots(params);
  try {
    const { data, error } = await supabase.from('garages')
      .select('spots')
      .eq('id', garage_id);

    if (error) throw error;
    console.log('this is the data from availableSpots:', data);
    return await data[0].spots - (occupied + reserved);
  } catch (error) {
    console.log(error);
    return null;
  }
}
//generates a list of reservations for a given garage and date
const getReservationsList = async (params) => {
  const { garage_id, date } = params;
  try {
    const { data, error } = await supabase.from('reservations')
      .select('id, time, status, parking_spot_id, cars (  make, model, color  )')
      .match({ 'garage_id': garage_id, 'date': date })
      .filter('status', 'in', '("reserved","checked-in")')
      .order('time', { ascending: true });

    if (error) throw error;
    console.log('this is the data from resList:', data);
    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getReservationDetails = async (params) => {
  const { reservation_id } = params;
  try {
    const { data, error } = await supabase.from('reservations')
      .select('status, time, parking_spot_id, id, date, cars (  make, model, color, license_plate_number  ), accounts (  first_name, last_name, phone_number, email  )')
      .match({ 'id': reservation_id });

    if (error) throw error;
    console.log('this is the data from resDetails:', data);
    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  getOccupiedSpots,
  getReservedSpots,
  getAvailableSpots,
  getReservationsList,
  getReservationDetails
}