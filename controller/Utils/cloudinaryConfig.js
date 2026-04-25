const axios = require('axios')
const  FormData = require("form-data")

     const CLOUDFLARE_ID = process.env.CLOUDFLARE_ID
      const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

         const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ID}/images/v1`;

const uploadToCloudflare = async (fileBuffer, filename, mimetype) => {
  const form = new FormData();
  form.append("file", fileBuffer, { filename, contentType: mimetype });
  form.append("requireSignedURLs", "false");

  const cfRes = await axios.post(cfUrl, form, {
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      ...form.getHeaders(),
    },
  });

  return cfRes.data.result.variants[0]; // returns the uploaded image URL
};

module.exports = uploadToCloudflare