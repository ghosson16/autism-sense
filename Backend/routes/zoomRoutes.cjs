const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.post('/generateSignature', (req, res) => {
  const { sessionName, role } = req.body;
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2; // Signature expires in 2 hours

  const oHeader = { alg: 'HS256', typ: 'JWT' };
  const oPayload = {
    app_key: process.env.ZOOM_API_KEY,
    tpc: sessionName,
    role: role,
    exp: exp,
    iat: iat
  };

  const sHeader = Buffer.from(JSON.stringify(oHeader)).toString('base64').replace(/=/g, '');
  const sPayload = Buffer.from(JSON.stringify(oPayload)).toString('base64').replace(/=/g, '');
  const data = sHeader + '.' + sPayload;

  const signature = crypto.createHmac('sha256', process.env.ZOOM_API_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '');

  const jwtToken = `${sHeader}.${sPayload}.${signature}`;
  res.json({ signature: jwtToken });
});

module.exports = router;
