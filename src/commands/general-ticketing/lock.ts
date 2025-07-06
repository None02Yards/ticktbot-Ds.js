// src/commands/general-ticketing/lock.ts
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const lockCommand = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock the current ticket thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;
    if (!thread?.isThread()) {
      return interaction.reply({ content: '❌ This command must be used inside a ticket thread.', ephemeral: true });
    }

    if (thread.locked) {
      return interaction.reply({ content: '⚠️ This thread is already locked.', ephemeral: true });
    }

    try {
      await thread.setLocked(true, 'Locked via /lock command');
      await interaction.reply({ content: '🔒 Ticket thread has been locked.', ephemeral: true });
    } catch {
      await interaction.reply({ content: '❌ Failed to lock the thread.', ephemeral: true });
    }
  },
};
