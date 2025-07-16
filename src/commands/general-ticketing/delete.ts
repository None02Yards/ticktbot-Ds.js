// src/commands/general-ticketing/delete.ts
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { deleteThread } from '../../utils/ticketActions';

export const deleteCommand = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete the current ticket thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;
    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ This command must be used inside a ticket thread.',
        ephemeral: true,
      });
    }

    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({
        content: '❌ You do not have permission to delete this thread.',
        ephemeral: true,
      });
    }

    try {
      await interaction.reply({
        content: '🗑️ Deleting thread...',
        ephemeral: true,
      });
      await deleteThread(thread);
    } catch (err: any) {
      await interaction.followUp({
        content: `❌ ${err.message}`,
        ephemeral: true,
      });
    }
  },
};
