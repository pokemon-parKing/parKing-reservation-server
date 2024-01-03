const { convertTime } = require("./convertTime.js");

const emailTemplate = (data, qr_code) => {
  const {
    id,
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
    }} = data;

  return (`
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #333;">Reservation Confirmation</h1>
      <p>Your Reservation Details:</p>
      <ul>
        <li>Parking Spot ID: ${parking_spot_id}</li>
        <li>Date: ${date}</li>
        <li>Time: ${convertTime(time)}</li>
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
  `)
}

module.exports = emailTemplate;