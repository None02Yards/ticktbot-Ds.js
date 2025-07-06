// src/commands/general-ticketing/close.ts
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const closeCommand = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Archive the current ticket thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;
    if (!thread?.isThread()) {
      return interaction.reply({ content: '❌ This command must be used inside a ticket thread.', ephemeral: true });
    }

    if (thread.archived) {
      return interaction.reply({ content: '⚠️ This thread is already archived.', ephemeral: true });
    }

    try {
      await thread.setArchived(true, 'Archived via /close command');
      await interaction.reply({ content: '📌 Ticket thread has been archived.', ephemeral: true });
    } catch {
      await interaction.reply({ content: '❌ Failed to archive the thread.', ephemeral: true });
    }
  },
};
