const supabase = require('../db.js');

const checkReservation = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('reservations')
      .select()
      .eq('car_id', req.body.car_id)
      .in('status', ['reserved', 'checked-in'])

    console.log(await data)

    if (error) throw error;

    if (await data.length > 0) {
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