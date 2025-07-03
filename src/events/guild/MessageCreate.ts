import { Events, Message, EmbedBuilder, TextChannel } from 'discord.js';

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot || !message.guild) return;

    // Find a guild text channel named “logs” and narrow its type
    const logChannel = message.guild.channels.cache
      .find((c): c is TextChannel => c.name === 'logs' && c.isTextBased());

    if (!logChannel || !message.member) return;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.member.displayName,
        iconURL: message.member.displayAvatarURL(),
      })
      .setDescription(message.content)
      .addFields({ name: 'Channel', value: `<#${message.channel.id}>`, inline: true })
      .setTimestamp();

    // Now TS knows logChannel has a .send() method
    await logChannel.send({ embeds: [embed] });
  },
};
