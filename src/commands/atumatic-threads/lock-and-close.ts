import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const lockAndCloseCommand = {
  data: new SlashCommandBuilder()
    .setName('lock-and-close')
    .setDescription('Lock and archive the current thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;

    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ This command must be used inside a thread.',
        ephemeral: true,
      });
    }

    try {
      const updates = [];

      if (!thread.locked) {
        updates.push(thread.setLocked(true, 'Locked via /lock-and-close'));
      }

      if (!thread.archived) {
        updates.push(thread.setArchived(true, 'Archived via /lock-and-close'));
      }

      await Promise.all(updates);

      await interaction.reply({
        content: '🔒📁 Thread locked and archived.',
        ephemeral: true,
      });
    } catch (err) {
      console.error('Failed to lock/archive thread:', err);
      await interaction.reply({
        content: '❌ Could not lock and archive the thread.',
        ephemeral: true,
      });
    }
  },
};
