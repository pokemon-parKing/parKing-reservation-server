const supabase = require('../db');
const QRCode = require('qrcode');

async function generateAndStoreQRCode(reservationId) {
  try {
    const qrBuffer = await QRCode.toBuffer(`${reservationId}`);

    const { data, error } = await supabase.storage
      .from('qrcodes')
      .upload(`${reservationId}.png`, qrBuffer, {
        contentType: 'image/png',
      })

    if (error) {
      console.error('Error uploading QR code to Supabase:', error);
      return null;
    }
    return data.fullPath;
  } catch (error) {
    console.error('Error generating and uploading QR code:', error);
    return null;
  }
}

module.exports = { generateAndStoreQRCode };