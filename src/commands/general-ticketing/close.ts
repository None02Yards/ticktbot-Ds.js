// src/commands/general-ticketing/close.ts
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { closeThread } from '../../utils/ticketActions';

export const closeCommand = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Archive the current ticket thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;
    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ This command must be used inside a ticket thread.',
        ephemeral: true,
      });
    }

    try {
      await closeThread(thread, interaction.user.tag);
      await interaction.reply({
        content: '📁 Thread archived.',
        ephemeral: true,
      });
    } catch (err: any) {
      await interaction.reply({
        content: `❌ ${err.message}`,
        ephemeral: true,
      });
    }
  },
};
