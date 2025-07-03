import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import { config } from '../../config';

export const deleteTicketCommand = {
  data: new SlashCommandBuilder()
    .setName('delete-ticket')
    .setDescription('Delete your open ticket thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.user;
    const channel = interaction.guild?.channels.cache.get(config.ticketChannelId) as TextChannel;

    const thread = channel?.threads.cache.find(
      (t) => t.name.includes(user.username) && !t.archived
    );

    if (!thread) {
      return interaction.reply({ content: '⚠️ No open ticket found.', ephemeral: true });
    }

    try {
      await thread.delete('Deleted via /delete-ticket');
      await interaction.reply({ content: `🗑️ Ticket thread <#${thread.id}> has been deleted.`, ephemeral: true });
    } catch (err) {
      console.error('Failed to delete thread:', err);
      await interaction.reply({ content: '❌ Failed to delete your ticket.', ephemeral: true });
    }
  },
};
