// src/commands/general-ticketing/lock.ts
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { lockThread } from '../../utils/ticketActions';

export const lockCommand = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock the current ticket thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;
    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ This command must be used inside a ticket thread.',
        ephemeral: true,
      });
    }

    try {
      await lockThread(thread, interaction.user.tag);
      await interaction.reply({
        content: '🔒 Thread locked.',
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
