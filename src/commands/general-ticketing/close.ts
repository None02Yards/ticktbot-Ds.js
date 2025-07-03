import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
  ThreadChannel,
  GuildMember,
} from 'discord.js';
import { config } from '../../config';

export const closeTicketCommand = {
  data: new SlashCommandBuilder()
    .setName('close-ticket')
    .setDescription('Close your active ticket thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.user;
    const guild = interaction.guild;
    const channel = guild?.channels.cache.get(config.ticketChannelId);

    if (!channel || !channel.isTextBased()) {
      return interaction.reply({
        content: '❌ Ticket channel is invalid or missing.',
        ephemeral: true,
      });
    }

    // Try to find an open thread by user
    const textChannel = channel as TextChannel;
    const userThread = textChannel.threads.cache.find(
      (t) =>
        t.name.includes(user.username) &&
        !t.archived
    );

    if (!userThread) {
      return interaction.reply({
        content: '⚠️ No open ticket thread found for you.',
        ephemeral: true,
      });
    }

    try {
      await userThread.setArchived(true, 'Closed by user via /close-ticket');
      await interaction.reply({
        content: `✅ Your ticket thread <#${userThread.id}> has been archived.`,
        ephemeral: true,
      });
    } catch (err) {
      console.error('Failed to close ticket thread:', err);
      await interaction.reply({
        content: '❌ Failed to archive your ticket.',
        ephemeral: true,
      });
    }
  },
};
