const { Events, AuditLogEvent } = require('discord.js');
const { log } = require('../utils/logger');

async function getAuditReason(guild, action, targetId) {
  try {
    const logs = await guild.fetchAuditLogs({ type: action, limit: 5 });
    const entry = logs.entries.find((e) => e.target?.id === targetId);
    return entry?.reason || 'No reason provided';
  } catch {
    return 'Unknown (missing audit log permission)';
  }
}

module.exports = [
  {
    name: Events.GuildBanAdd,
    once: false,
    async execute(ban) {
      const reason = await getAuditReason(ban.guild, AuditLogEvent.MemberBanAdd, ban.user.id);
      await log(ban.guild, {
        category: 'moderation',
        title: '🔨 Member Banned',
        thumbnail: ban.user.displayAvatarURL(),
        fields: [
          { name: 'User', value: `${ban.user.tag} (${ban.user.id})`, inline: true },
          { name: 'Reason', value: reason },
        ],
      });
    },
  },
  {
    name: Events.GuildBanRemove,
    once: false,
    async execute(ban) {
      await log(ban.guild, {
        category: 'moderation',
        title: '🔓 Member Unbanned',
        thumbnail: ban.user.displayAvatarURL(),
        fields: [{ name: 'User', value: `${ban.user.tag} (${ban.user.id})`, inline: true }],
      });
    },
  },
];
