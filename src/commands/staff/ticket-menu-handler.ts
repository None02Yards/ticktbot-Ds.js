

import {
  StringSelectMenuInteraction,
  ChannelType,
  EmbedBuilder,
} from 'discord.js';
import { config } from '../../config';

interface TicketCategory {
  channelId: string;
  threadPrefix: string;
  description: string;
}

const ticketCategories: Record<string, TicketCategory> = {
  general_support: {
    channelId: config.generalSupportChannelId,
    threadPrefix: 'support',
    description: 'General Support',
  },
  billing: {
    channelId: config.billingChannelId,
    threadPrefix: 'billing',
    description: 'Billing',
  },
  member_report: {
    channelId: config.reportsChannelId,
    threadPrefix: 'report',
    description: 'Member Report',
  },
  report_nsfw: {
    channelId: config.reportsChannelId,
    threadPrefix: 'nsfw-report',
    description: 'NSFW Report',
  },
  // Add more categories here as needed
};

export default {
  customId: 'ticketTypeSelector',

  async execute(interaction: StringSelectMenuInteraction) {
    if (!interaction.guild) {
      return interaction.reply({ content: 'Guild not found.', ephemeral: true });
    }

    const user = interaction.user;
    const selected = interaction.values[0];
    const category = ticketCategories[selected];

    if (!category) {
      return interaction.reply({ content: 'Invalid category selected.', ephemeral: true });
    }

    const parentChannel = interaction.guild.channels.cache.get(category.channelId);

    if (!parentChannel || parentChannel.type !== ChannelType.GuildText) {
      return interaction.reply({ content: 'Ticket category channel not found or invalid.', ephemeral: true });
    }

    const threadName = `${category.threadPrefix}-${user.username}`.toLowerCase();

    try {
      const thread = await parentChannel.threads.create({
        name: threadName,
        autoArchiveDuration: 60,
        reason: `Ticket created by ${user.tag} for ${category.description}`,
        type: ChannelType.PublicThread,
      });

      await thread.members.add(user.id);

      const embed = new EmbedBuilder()
        .setTitle(`New Ticket: ${category.description}`)
        .setDescription(`${user}, a staff member will be with you shortly!`)
        .setColor(0x00b0f4)
        .setTimestamp();

      await thread.send({ content: `${user}`, embeds: [embed] });

      await interaction.reply({
        content: `🎫 Your ticket has been created: <#${thread.id}>`,
        ephemeral: true,
      });
    } catch (err) {
      console.error('Failed to create ticket thread:', err);
      await interaction.reply({
        content: '❌ Failed to create the ticket. Please contact staff.',
        ephemeral: true,
      });
    }
  },
};
