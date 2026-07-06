const { Events } = require('discord.js');
const { log } = require('../utils/logger');

module.exports = [
  {
    name: Events.ChannelCreate,
    once: false,
    async execute(channel) {
      if (!channel.guild) return;
      await log(channel.guild, {
        category: 'server',
        title: '➕ Channel Created',
        fields: [
          { name: 'Name', value: `${channel}`, inline: true },
          { name: 'Type', value: `${channel.type}`, inline: true },
        ],
      });
    },
  },
  {
    name: Events.ChannelDelete,
    once: false,
    async execute(channel) {
      if (!channel.guild) return;
      await log(channel.guild, {
        category: 'server',
        title: '➖ Channel Deleted',
        fields: [{ name: 'Name', value: `#${channel.name}`, inline: true }],
      });
    },
  },
  {
    name: Events.ChannelUpdate,
    once: false,
    async execute(oldChannel, newChannel) {
      if (!newChannel.guild) return;
      if (oldChannel.name !== newChannel.name) {
        await log(newChannel.guild, {
          category: 'server',
          title: '✏️ Channel Renamed',
          fields: [
            { name: 'Before', value: `#${oldChannel.name}`, inline: true },
            { name: 'After', value: `#${newChannel.name}`, inline: true },
          ],
        });
      }
    },
  },
  {
    name: Events.GuildRoleCreate,
    once: false,
    async execute(role) {
      await log(role.guild, {
        category: 'server',
        title: '➕ Role Created',
        fields: [{ name: 'Name', value: role.name, inline: true }],
      });
    },
  },
  {
    name: Events.GuildRoleDelete,
    once: false,
    async execute(role) {
      await log(role.guild, {
        category: 'server',
        title: '➖ Role Deleted',
        fields: [{ name: 'Name', value: role.name, inline: true }],
      });
    },
  },
  {
    name: Events.GuildRoleUpdate,
    once: false,
    async execute(oldRole, newRole) {
      if (oldRole.name !== newRole.name) {
        await log(newRole.guild, {
          category: 'server',
          title: '✏️ Role Renamed',
          fields: [
            { name: 'Before', value: oldRole.name, inline: true },
            { name: 'After', value: newRole.name, inline: true },
          ],
        });
      }
      if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
        await log(newRole.guild, {
          category: 'server',
          title: '🔐 Role Permissions Changed',
          fields: [{ name: 'Role', value: newRole.name, inline: true }],
        });
      }
    },
  },
];
