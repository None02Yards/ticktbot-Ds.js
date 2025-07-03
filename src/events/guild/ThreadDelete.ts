import { Events, ThreadChannel, EmbedBuilder, TextChannel } from 'discord.js';

export default {
  name: Events.ThreadDelete,
  once: false,
  async execute(thread: ThreadChannel) {
    const guild = thread.guild;
    const ownerId = thread.ownerId;
    if (!guild || !ownerId) return;

    const member = await guild.members.fetch(ownerId).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle('🗑️ Thread Deleted')
      .setDescription(`Thread **${thread.name}** was deleted.`)
      .setFooter({ text: `Author: ${member?.displayName ?? ownerId}` })
      .setTimestamp();

    // Narrow to TextChannel so TS knows .send() is available
    const logChannel = guild.channels.cache
      .find(
        (c): c is TextChannel =>
          c.name === 'thread-logs' && c.isTextBased()
      );

    if (!logChannel) return;
    await logChannel.send({ embeds: [embed] });
  },
};
