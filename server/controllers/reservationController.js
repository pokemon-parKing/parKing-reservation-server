const supabase = require("../db.js");
require("dotenv").config();
const nodemailer = require("nodemailer");
const { convertTime } = require("../lib/convertTime.js");

/*
  params are based on user's input,
  expected { lat: number, lng, number }
  (the request will convert to a string but it is converted back in the code)
*/
const getNearestGarages = async (params) => {
  const { lat, lng } = params;

  try {
    const { data, error } = await supabase
      .from("garages")
      .select()
      .filter("lat", "gte", +lat - 0.5)
      .filter("lat", "lte", +lat + 0.5)
      .filter("lng", "gte", +lng - 0.5)
      .filter("lng", "lte", +lng + 0.5);

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
    const { data, error } = await supabase
      .from("reservations")
      .select()
      .eq("id", id)
      .single();

    if (error) throw error;

    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

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
    const { data, error } = await supabase
      .from("reservations")
      .select()
      .match({ garage_id: garage_id, date: date })
      .filter("status", "in", '("reserved","checked-in")');

    if (error) throw error;

    const list = {};

    await data.forEach((reservation) => {
      if (reservation.date !== date) return;

      if (list.hasOwnProperty(reservation.time)) {
        list[reservation.time]++;
      } else {
        list[reservation.time] = 1;
      }
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
};

/*
  PURELY FOR TESTING - to be deleted in production
*/
const testAllReservations = async (garage_id) => {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select()
      .eq("garage_id", garage_id);

    if (error) throw error;

    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

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
    const { data, error } = await supabase
      .from("reservations")
      .insert(reservation)
      .select();

    if (error) throw error;

    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/*
  query contains { reservation_id, status } both strings
  reservation id is from the path query and status is from the params
  This is consolidated in the route handler and passed here to the controller
  status must be one of the following ['checked-in', 'picked-up', 'cancelled'];
*/
const updateReservation = async (query) => {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .update({ status: query.status })
      .eq("id", query.id)
      .select();

    if (error) throw error;

    return await data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// const createReservation = async (reservation) => {
//   try {
//     const { data, error } = await supabase
//       .from("reservations")
//       .insert(reservation)
//       .select();

//     if (error) throw error;

//     return await data;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

const sendEmail = async (reservationId) => {
  try {
    const { data: combinedData, error: combinedError } = await supabase
      .from("reservations")
      .select(
        `
        id,
        parking_spot_id,
        date,
        time,
        status,
        user_id:accounts(id, email),
        garage_id:garages(id, name, address, city, state, country, zip)
      `
      )
      .eq("id", reservationId)
      .single();

    if (combinedError) {
      console.error("Error querying Supabase:", combinedError.message);
      throw new Error("Internal Server Error");
    }

    const {
      id,
      user_id: { email: userEmail },
      parking_spot_id,
      date,
      time,
      status,
      garage_id: {
        name: garageName,
        address: garageAddress,
        city: garageCity,
        state: garageState,
        country: garageCountry,
        zip: garageZip,
      },
    } = combinedData;

    const convertedTime = convertTime(time);

    const { data: qrData, error: qrError } = await supabase.storage
      .from("qrcodes")
      .getPublicUrl(`${reservationId}.png`);

    if (qrError) {
      console.error("Error downloading QR code from Supabase:", qrError);
      return null;
    }

    const qr_code = qrData.publicUrl;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Reservation Confirmation",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #333;">Reservation Confirmation</h1>
        <p>Your Reservation Details:</p>
        <ul>
          <li>Parking Spot ID: ${parking_spot_id}</li>
          <li>Date: ${date}</li>
          <li>Time: ${convertedTime}</li>
          <li>Status: ${status}</li>
        </ul>
        <p>Garage Details:</p>
        <ul>
          <li>Name: ${garageName}</li>
          <li>Address: ${garageAddress}, ${garageCity}, ${garageState}, ${garageCountry}, ${garageZip}</li>
        </ul>
        <p>QR Code:</p>
        <img src="${qr_code}" alt="QR Code" style="max-width: 100%;">
      </div>
    `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

module.exports = {
  getNearestGarages,
  getAllReservations,
  testAllReservations,
  createReservation,
  updateReservation,
  getReservation,
  sendEmail,
};
