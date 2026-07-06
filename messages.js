const { Events } = require('discord.js');
const { log } = require('../utils/logger');

module.exports = [
  {
    name: Events.MessageDelete,
    once: false,
    async execute(message) {
      if (!message.guild || message.author?.bot) return;
      await log(message.guild, {
        category: 'message',
        title: '🗑️ Message Deleted',
        description: message.content || '*(no text content — embed, attachment, or uncached)*',
        fields: [
          { name: 'Author', value: message.author ? `${message.author.tag} (${message.author.id})` : 'Unknown', inline: true },
          { name: 'Channel', value: `${message.channel}`, inline: true },
        ],
        image: message.attachments?.first()?.url,
      });
    },
  },
  {
    name: Events.MessageUpdate,
    once: false,
    async execute(oldMessage, newMessage) {
      if (!newMessage.guild || newMessage.author?.bot) return;
      if (oldMessage.content === newMessage.content) return; // ignore embed-only updates
      await log(newMessage.guild, {
        category: 'message',
        title: '✏️ Message Edited',
        fields: [
          { name: 'Author', value: `${newMessage.author.tag} (${newMessage.author.id})`, inline: true },
          { name: 'Channel', value: `${newMessage.channel}`, inline: true },
          { name: 'Before', value: oldMessage.content || '*(empty)*' },
          { name: 'After', value: newMessage.content || '*(empty)*' },
        ],
      });
    },
  },
  {
    name: Events.MessageBulkDelete,
    once: false,
    async execute(messages) {
      const first = messages.first();
      if (!first?.guild) return;
      await log(first.guild, {
        category: 'message',
        title: '🧹 Bulk Message Delete',
        description: `${messages.size} messages were purged.`,
        fields: [{ name: 'Channel', value: `${first.channel}`, inline: true }],
      });
    },
  },
];
