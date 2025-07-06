

// src/commands/atumatic-threads/lock-and-close.ts
import { ChatInputCommandInteraction, SlashCommandBuilder, ThreadChannel } from 'discord.js';

export const lockAndCloseCommand = {
  data: new SlashCommandBuilder()
    .setName('lock-close-thread')
    .setDescription('Lock and archive the current thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.channel;

    // Check if the command is used inside a thread channel
    if (!channel || !channel.isThread()) {
      return interaction.reply({
        content: '❌ This command must be used inside a thread.',
        ephemeral: true,
      });
    }

    const thread = channel as ThreadChannel;

    try {
      // Lock the thread if not locked yet
      if (!thread.locked) {
        await thread.setLocked(true, `Locked by ${interaction.user.tag} via /lock-and-close`);
      }

      // Archive the thread if not archived yet
      if (!thread.archived) {
        await thread.setArchived(true, `Archived by ${interaction.user.tag} via /lock-and-close`);
      }

      await interaction.reply({
        content: '🔒📁 Thread locked and archived successfully.',
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error locking or archiving thread:', error);
      await interaction.reply({
        content: '❌ Failed to lock and archive the thread. Make sure I have the right permissions.',
        ephemeral: true,
      });
    }
  },
};
