require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.DB_HOST, process.env.DB_KEY);

const Reservations = supabase.from('reservations');
const Garages = supabase.from('garages');
const ParkingSpots = supabase.from('parking_spots');
const Cars = supabase.from('cars');
const Accounts = supabase.from('accounts');

module.exports = { Reservations, Garages, ParkingSpots };