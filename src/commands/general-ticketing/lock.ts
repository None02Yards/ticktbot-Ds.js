import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { config } from '../../config';

export const lockTicketCommand = {
  data: new SlashCommandBuilder()
    .setName('lock-ticket')
    .setDescription('Lock your open ticket thread (read-only)'),

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

    const textChannel = channel as TextChannel;
    const userThread = textChannel.threads.cache.find(
      (t) =>
        t.name.includes(user.username) &&
        !t.locked
    );

    if (!userThread) {
      return interaction.reply({
        content: '⚠️ No open unlocked thread found for you.',
        ephemeral: true,
      });
    }

    try {
      await userThread.setLocked(true, 'Locked via /lock-ticket');
      await interaction.reply({
        content: `🔒 Ticket thread <#${userThread.id}> has been locked.`,
        ephemeral: true,
      });
    } catch (err) {
      console.error('Failed to lock ticket thread:', err);
      await interaction.reply({
        content: '❌ Failed to lock your ticket.',
        ephemeral: true,
      });
    }
  },
};
