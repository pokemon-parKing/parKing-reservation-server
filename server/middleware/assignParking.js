const supabase = require('../db.js');

const assignParking = async (req, res, next) => {
  const [{ data: ParkingData, error: ParkingError }, { data: ReservationData, error: ReservationError }] = await Promise.all([
    supabase.from('parking_spots')
    .select(`id`)
    .eq('garage_id', req.body.garage_id)
    .order('id', { ascending: true }),
    supabase.from('reservations')
    .select(`parking_spot_id`)
    .match({ date: req.body.date, time: req.body.time, garage_id: req.body.garage_id })
    .order('parking_spot_id', { ascending: true })
  ]);

  if (ParkingError || ReservationError) {
    console.log(ParkingError);
    return res.sendStatus(500);
  }

  let parkingSpot;

  while (!parkingSpot && ParkingData.length > 0 && ReservationData.length > 0) {
    const spot = await ParkingData.shift();
    const reservation = await ReservationData.shift();

    if (spot.id !== reservation.parking_spot_id) {
      parkingSpot = spot.id;
    }
  }

  if (ReservationData.length === 0) {
    parkingSpot = await ParkingData[0].id
  }

  if (!parkingSpot) {
    return res.sendStatus(400);
  }
  req.body['parking_spot_id'] = parkingSpot;
  next();
}

module.exports = assignParking;