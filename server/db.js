require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.DB_HOST, process.env.DB_KEY);

const Reservations = supabase.from('reservations');
const Garages = supabase.from('garages');

module.exports = { Reservations, Garages };