
// src/commands/general-ticketing/rename-title.ts
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { renameThread } from '../../utils/ticketActions';

export const renameTicketTitleCommand = {
  data: new SlashCommandBuilder()
    .setName('rename-ticket')
    .setDescription('Rename the current ticket thread')
    .addStringOption(option =>
      option
        .setName('new_title')
        .setDescription('New thread title (1–100 characters)')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const newTitle = interaction.options.getString('new_title', true);
    const thread = interaction.channel;

    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ This command must be used inside a ticket thread.',
        ephemeral: true,
      });
    }

    try {
      await renameThread(thread, newTitle);
      await interaction.reply({
        content: `✏️ Thread renamed to: \`${newTitle}\``,
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
