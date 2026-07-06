const { Events } = require('discord.js');
const { log } = require('../utils/logger');

module.exports = [
  {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member) {
      const ageMs = Date.now() - member.user.createdTimestamp;
      const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
      await log(member.guild, {
        category: 'member',
        title: '📥 Member Joined',
        thumbnail: member.user.displayAvatarURL(),
        fields: [
          { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
          { name: 'Account Age', value: `${ageDays} days`, inline: true },
          { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true },
        ],
      });
    },
  },
  {
    name: Events.GuildMemberRemove,
    once: false,
    async execute(member) {
      const roles = member.roles?.cache
        ?.filter((r) => r.id !== member.guild.id)
        .map((r) => r.name)
        .join(', ') || 'None';
      await log(member.guild, {
        category: 'member',
        title: '📤 Member Left',
        thumbnail: member.user.displayAvatarURL(),
        fields: [
          { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
          { name: 'Roles', value: roles },
        ],
      });
    },
  },
  {
    name: Events.GuildMemberUpdate,
    once: false,
    async execute(oldMember, newMember) {
      // Nickname change
      if (oldMember.nickname !== newMember.nickname) {
        await log(newMember.guild, {
          category: 'member',
          title: '📝 Nickname Changed',
          fields: [
            { name: 'User', value: `${newMember.user.tag} (${newMember.id})`, inline: true },
            { name: 'Before', value: oldMember.nickname || '*(none)*', inline: true },
            { name: 'After', value: newMember.nickname || '*(none)*', inline: true },
          ],
        });
      }

      // Role changes
      const oldRoles = oldMember.roles.cache;
      const newRoles = newMember.roles.cache;
      const added = newRoles.filter((r) => !oldRoles.has(r.id));
      const removed = oldRoles.filter((r) => !newRoles.has(r.id));
      if (added.size || removed.size) {
        await log(newMember.guild, {
          category: 'member',
          title: '🎭 Roles Updated',
          fields: [
            { name: 'User', value: `${newMember.user.tag} (${newMember.id})`, inline: true },
            ...(added.size ? [{ name: 'Added', value: added.map((r) => r.name).join(', ') }] : []),
            ...(removed.size ? [{ name: 'Removed', value: removed.map((r) => r.name).join(', ') }] : []),
          ],
        });
      }

      // Timeout (communication disabled) changes
      const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
      const newTimeout = newMember.communicationDisabledUntilTimestamp;
      if (oldTimeout !== newTimeout) {
        if (newTimeout && newTimeout > Date.now()) {
          await log(newMember.guild, {
            category: 'moderation',
            title: '🔇 Member Timed Out',
            fields: [
              { name: 'User', value: `${newMember.user.tag} (${newMember.id})`, inline: true },
              { name: 'Until', value: `<t:${Math.floor(newTimeout / 1000)}:F>`, inline: true },
            ],
          });
        } else if (oldTimeout) {
          await log(newMember.guild, {
            category: 'moderation',
            title: '🔊 Timeout Removed',
            fields: [{ name: 'User', value: `${newMember.user.tag} (${newMember.id})`, inline: true }],
          });
        }
      }
    },
  },
];
