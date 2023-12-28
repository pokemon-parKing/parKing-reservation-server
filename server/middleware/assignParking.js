const { ParkingSpots, Reservations } = require('../db.js');

const assignParking = async (req, res, next) => {
  const { data: ParkingData, error: ParkingError } = await ParkingSpots
    .select(`id`)
    .eq('garage_id', req.body.garage_id)
    .order('id', { ascending: true })

  const { data: ReservationData, error: ReservationError } = await Reservations
    .select(`parking_spot_id`)
    .match({ date: req.body.date, time: req.body.time, garage_id: req.body.garage_id })
    .order('parking_spot_id', { ascending: true })

  if (ParkingError || ReservationError) {
    console.log(ParkingError);
    return res.sendStatus(500);
  }

  let parkingSpot;

  while (!parkingSpot && ParkingData.length > 0 && ReservationData.length > 0) {
    const spot = ParkingData.shift();
    const reservation = ReservationData.shift();

    if (spot.id !== reservation.parking_spot_id) {
      parkingSpot = spot.id;
    }
  }

  if (ReservationData.length === 0) {
    parkingSpot = ParkingData[0].id
  }

  if (!parkingSpot) {
    return res.sendStatus(400);
  }
  req.body['parking_spot_id'] = parkingSpot;
  next();
}

module.exports = assignParking;