const { Reservations } = require('../db.js');
const { supabase } = require('../db');
const QRCode = require('qrcode');

async function generateAndStoreQRCode(reservationId) {
  console.log('Generating QR code for reservation ID:', reservationId);
  try {
    const qrCodeBuffer = await QRCode.toBuffer(reservationId);
    // console.log('QR code buffer:', qrCodeBuffer); // uncomment to see the buffer.

    const { data, error } = await supabase.storage
      .from('qrcodes') //the name of the bucket I created in supabase
      .upload(`${reservationId}.png`, qrCodeBuffer);

    if (error) {
      console.error('Error uploading QR code to Supabase:', error);
      return null;
    }

    const qrCodeUrl = data[0].url;
    console.log('QR code URL:', qrCodeUrl);
    const { data: updatedReservation, error: updateError } = await Reservations
      .update({ qrCodeUrl })
      .eq('id', reservationId);

    if (updateError) {
      console.error('Error updating reservation with QR code URL:', updateError);
      return null;
    }

    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating and uploading QR code:', error);
    return null;
  }
}

module.exports = { generateAndStoreQRCode };