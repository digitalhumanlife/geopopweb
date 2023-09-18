const config = require('../../config');

const accountSid = config.twilio.accountSid;
const authToken = config.twilio.authToken;
const client = require('twilio')(accountSid, authToken);

async function sendSmsCode(to, code) {
  client.messages
    .create({
      body: `BITE Login Code: ${code}`,
      from: config.twilio.fromNumber,
      to: to,
    })
    .then(message => console.log(message.sid));
}

module.exports = {
  sendSmsCode,
};
