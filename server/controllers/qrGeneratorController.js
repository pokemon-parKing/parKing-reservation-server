const supabase = require('../db');
const QRCode = require('qrcode');
const fs = require('fs').promises;
const { createReadStream } = require('fs')
const path = require('path');

  async function generateAndStoreQRCode(reservationId) {
  try {
    //route to the tempImage storage
    const tempImagesDir = path.join(__dirname, '../tempImages');

    //data to encode in the QR code
    const dataToEncode = `${reservationId}`
    //buffer to store the QR code
    const qrCodeBuffer = await QRCode.toBuffer(dataToEncode);
    const filePath = `${tempImagesDir}/${reservationId}.png`;

    await fs.writeFile(filePath, qrCodeBuffer);

    const fileContent = await fs.readFile(filePath);
    // console.log('fileContent: ', fileContent);

    const { data, error } = await supabase.storage
      .from('qrcodes')
      .upload(`${reservationId}.png`, fileContent, {
        contentType: 'image/png',
      });
      //remove the file from the tempImages folder
      await fs.unlink(filePath);

    if (error) {
      console.error('Error uploading QR code to Supabase:', error);
      return null;
    }
    return true;
  } catch (error) {
    console.error('Error generating and uploading QR code:', error);
    return null;
  }
}

module.exports = { generateAndStoreQRCode };