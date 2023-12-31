const supabase = require('../db');

const getQrCode = async (reservationId) => {

  try {
    const filePath = `${reservationId}.png`;
    const { data, error } = await supabase.storage.from('qrcodes').getPublicUrl(filePath);

    if (error) {
      console.error('Error downloading QR code from Supabase:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error downloading QR code from Supabase:', error);
    return null;
  }

};

module.exports = { getQrCode };