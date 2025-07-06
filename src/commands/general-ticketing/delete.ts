// src/commands/general-ticketing/delete.ts
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionsBitField } from 'discord.js';

export const deleteCommand = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete the current ticket thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;
    if (!thread?.isThread()) {
      return interaction.reply({ content: '❌ This command must be used inside a ticket thread.', ephemeral: true });
    }

    // Check if the user has permission to delete (e.g., Manage Channels)
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: '❌ You do not have permission to delete this thread.', ephemeral: true });
    }

    try {
      await thread.delete('Deleted via /delete command');
      // No need to reply since the thread is deleted
    } catch {
      await interaction.reply({ content: '❌ Failed to delete the thread.', ephemeral: true });
    }
  },
};
