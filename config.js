require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  // Name of the channel logs get posted to (must already exist in the server)
  logChannelName: process.env.LOG_CHANNEL_NAME || 'logs',
};
