const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
  ],
  // Partials let us still receive events for uncached messages/members (e.g. old messages getting edited/deleted)
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember],
});

// Auto-load every event file in ./events — each file exports an array of { name, once, execute }
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter((f) => f.endsWith('.js'))) {
  const handlers = require(path.join(eventsPath, file));
  for (const handler of handlers) {
    if (handler.once) {
      client.once(handler.name, (...args) => handler.execute(...args));
    } else {
      client.on(handler.name, (...args) => handler.execute(...args));
    }
  }
}

client.once('ready', (c) => console.log(`Logger bot online as ${c.user.tag}`));

client.login(token);
