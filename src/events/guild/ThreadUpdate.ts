import { Events, ThreadChannel, EmbedBuilder, TextChannel } from 'discord.js';

export default {
  name: Events.ThreadUpdate,
  once: false,
  async execute(oldThread: ThreadChannel, newThread: ThreadChannel) {
    // Only react to name changes
    if (oldThread.name === newThread.name) return;

    const guild = newThread.guild;
    const member = await guild.members.fetch(newThread.ownerId!).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle('✏️ Thread Renamed')
      .addFields(
        { name: 'Old Name', value: oldThread.name, inline: true },
        { name: 'New Name', value: newThread.name, inline: true },
        { name: 'By', value: member ? `<@${member.id}>` : 'Unknown', inline: true }
      )
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
