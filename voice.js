const { Events } = require('discord.js');
const { log } = require('../utils/logger');

module.exports = [
  {
    name: Events.VoiceStateUpdate,
    once: false,
    async execute(oldState, newState) {
      const guild = newState.guild;
      const member = newState.member;

      // Joined a voice channel
      if (!oldState.channel && newState.channel) {
        await log(guild, {
          category: 'voice',
          title: '🔊 Joined Voice Channel',
          fields: [
            { name: 'User', value: `${member.user.tag}`, inline: true },
            { name: 'Channel', value: `${newState.channel}`, inline: true },
          ],
        });
        return;
      }

      // Left voice entirely
      if (oldState.channel && !newState.channel) {
        await log(guild, {
          category: 'voice',
          title: '🔈 Left Voice Channel',
          fields: [
            { name: 'User', value: `${member.user.tag}`, inline: true },
            { name: 'Channel', value: `${oldState.channel}`, inline: true },
          ],
        });
        return;
      }

      // Switched channels
      if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        await log(guild, {
          category: 'voice',
          title: '🔀 Switched Voice Channel',
          fields: [
            { name: 'User', value: `${member.user.tag}`, inline: true },
            { name: 'From', value: `${oldState.channel}`, inline: true },
            { name: 'To', value: `${newState.channel}`, inline: true },
          ],
        });
      }
    },
  },
];
