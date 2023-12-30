require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.DB_HOST, process.env.DB_KEY);

module.exports = { Reservations, Garages, ParkingSpots, supabase };
module.exports = supabase;
