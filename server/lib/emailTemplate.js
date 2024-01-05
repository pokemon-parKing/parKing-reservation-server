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
    },
  } = data;

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; width: fit-content;">
      <div style="background-color: #e5e7eb; color: black; padding: 10px; text-align: center; border-radius: 5px 5px 0 0; margin-bottom: 10px;">
      <img src="cid:unique@kreata.ee" alt="parKing" style="max-width: 100px;">
        <h1 style="margin: 0;">Reservation Confirmation</h1>
      </div>
      <p>Dear Customer,</p>
      <p>We are pleased to confirm your reservation with the following details:</p>
      <ul>
        <li><strong>Parking Spot ID:</strong> ${parking_spot_id}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${convertTime(time)}</li>
        <li><strong>Status:</strong> ${status}</li>
      </ul>
      <p>Garage Details:</p>
      <ul>
        <li><strong>Name:</strong> ${garageName}</li>
        <li><strong>Address:</strong> ${garageAddress}, ${garageCity}, ${garageState}, ${garageCountry}, ${garageZip}</li>
      </ul>
      <p><strong>QR Code:</strong></p>
      <img src="${qr_code}" alt="QR Code" style="max-width: 100%; margin-bottom: 20px;">
      <p>We look forward to serving you. If you have any questions or need further assistance, please feel free to contact us.</p>
      <p>Best Regards,<br>parKing Reservations</p>
    </div>
  `;
};

module.exports = emailTemplate;
