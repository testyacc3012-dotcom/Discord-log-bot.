const { EmbedBuilder, ChannelType } = require('discord.js');
const { logChannelName } = require('../config');

// Cache resolved log channel per guild so we don't search every time
const channelCache = new Map();

async function getLogChannel(guild) {
  if (!guild) return null;

  const cached = channelCache.get(guild.id);
  if (cached) {
    // Make sure it's still valid (channel could've been deleted/renamed)
    const stillThere = guild.channels.cache.get(cached.id);
    if (stillThere) return stillThere;
    channelCache.delete(guild.id);
  }

  const channel = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && c.name === logChannelName
  );

  if (channel) channelCache.set(guild.id, channel);
  return channel || null;
}

const COLORS = {
  message: 0x5865f2, // blurple
  member: 0x57f287, // green
  moderation: 0xed4245, // red
  server: 0xfee75c, // yellow
  voice: 0xeb459e, // pink
};

/**
 * Send a log embed to the guild's configured log channel.
 * @param {Guild} guild
 * @param {object} opts
 * @param {'message'|'member'|'moderation'|'server'|'voice'} opts.category
 * @param {string} opts.title
 * @param {string} [opts.description]
 * @param {Array<{name: string, value: string, inline?: boolean}>} [opts.fields]
 * @param {string} [opts.thumbnail]
 * @param {string} [opts.image]
 */
async function log(guild, { category, title, description, fields = [], thumbnail, image }) {
  const channel = await getLogChannel(guild);
  if (!channel) return; // silently skip if no log channel found

  const embed = new EmbedBuilder()
    .setColor(COLORS[category] || 0x99aab5)
    .setTitle(title)
    .setTimestamp();

  if (description) embed.setDescription(description.slice(0, 4096));
  if (fields.length) embed.addFields(fields.map((f) => ({ ...f, value: f.value?.toString().slice(0, 1024) || '\u200b' })));
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (image) embed.setImage(image);

  await channel.send({ embeds: [embed] }).catch((e) => console.error('Failed to send log:', e.message));
}

module.exports = { log, getLogChannel };
