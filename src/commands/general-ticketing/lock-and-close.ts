import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import { config } from '../../config';

export const lockAndCloseTicketCommand = {
  data: new SlashCommandBuilder()
    .setName('lock-and-close-ticket')
    .setDescription('Lock and archive your open ticket thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.user;
    const channel = interaction.guild?.channels.cache.get(config.ticketChannelId) as TextChannel;

    const thread = channel?.threads.cache.find(
      (t) => t.name.includes(user.username) && (!t.locked || !t.archived)
    );

    if (!thread) {
      return interaction.reply({ content: '⚠️ No eligible ticket found.', ephemeral: true });
    }

    try {
      await Promise.all([
        thread.locked ? null : thread.setLocked(true, 'Locked via /lock-and-close-ticket'),
        thread.archived ? null : thread.setArchived(true, 'Closed via /lock-and-close-ticket'),
      ]);

      await interaction.reply({ content: `🔒📁 Ticket <#${thread.id}> locked and archived.`, ephemeral: true });
    } catch (err) {
      console.error('Failed to lock/archive thread:', err);
      await interaction.reply({ content: '❌ Failed to complete the operation.', ephemeral: true });
    }
  },
};
