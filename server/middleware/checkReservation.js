const supabase = require('../db.js');

const checkReservation = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('reservations')
      .select()
      .match({ car_id: req.body.car_id, date: req.body.date, time: req.body.time })
      .in('status', ['reserved', 'checked-in'])

    if (error) throw error;

    if (data.length > 0) {
      return res.sendStatus(409);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

module.exports = checkReservation;