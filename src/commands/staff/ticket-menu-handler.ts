

// src/commands/staff/ticket-menu-handler.ts
import {
  StringSelectMenuInteraction,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from 'discord.js';
import { config } from '../../config';
import { postTicketIntro } from '../../utils/ticketUtils';

export default {
  customId: 'ticketTypePrimarySelector', // for first dropdown

  async execute(interaction: StringSelectMenuInteraction) {
    const user = interaction.user;

    // FIRST DROPDOWN: Select Normal or Threaded ticket
    if (interaction.customId === 'ticketTypePrimarySelector') {
      const selected = interaction.values[0];

      // Fetch the ticket channel once
      const ticketChannel = interaction.guild?.channels.cache.get(config.ticketChannelId);
      if (!ticketChannel || !(ticketChannel instanceof TextChannel)) {
        return interaction.reply({
          content: '❌ Ticket channel not found or invalid.',
          ephemeral: true,
        });
      }

      if (selected === 'normal_ticket') {
        // Normal ticket: single message with buttons (no thread)
        const embed = new EmbedBuilder()
          .setTitle(`🎫 Ticket from ${user.tag}`)
          .setDescription('This is your ticket. Staff will assist you here.')
          .setColor(0x00AE86)
          .setTimestamp();

        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('lock-ticket')
            .setLabel('🔒 Lock')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('close-ticket')
            .setLabel('📁 Close')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('delete-ticket')
            .setLabel('🗑️ Delete')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('rename-ticket')
            .setLabel('✏️ Rename')
            .setStyle(ButtonStyle.Secondary)
        );

        await ticketChannel.send({ content: `<@${user.id}>`, embeds: [embed], components: [buttons] });

        return interaction.reply({
          content: '✅ Your normal ticket message has been created.',
          ephemeral: true,
        });

      } else if (selected === 'threaded_ticket') {
        // Threaded ticket: send SECOND dropdown for detailed ticket reason
        const detailedSelect = new StringSelectMenuBuilder()
          .setCustomId('ticketTypeSecondarySelector')
          .setPlaceholder('Select the detailed ticket reason')
          .addOptions(
            {
              label: 'Report NSFW Content',
              value: 'report_nsfw',
              description: 'Choose this option if your ticket involves anything 18+',
              emoji: '🔞',
            },
            {
              label: 'Member Reports',
              value: 'member_report',
              description: 'Report a server member',
              emoji: '📛',
            },
            {
              label: 'Server Inquiries',
              value: 'server_inquiry',
              description: 'Ask a question about the server',
              emoji: '❓',
            },
            {
              label: 'Moderation Appeals',
              value: 'mod_appeal',
              description: 'Appeal a moderation action',
              emoji: '👮‍♂️',
            },
            {
              label: 'Contact NTTS',
              value: 'contact_ntts',
              description: 'Private video ideas, important stuff',
              emoji: '🧠',
            }
          );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(detailedSelect);

        return interaction.update({
          content: 'Select the detailed ticket reason:',
          components: [row],
        });
      }
    }

    // SECOND DROPDOWN: Detailed ticket reason, create thread + post intro message with buttons
    else if (interaction.customId === 'ticketTypeSecondarySelector') {
      const reason = interaction.values[0];

      // Fetch ticket channel
      const ticketChannel = interaction.guild?.channels.cache.get(config.ticketChannelId);
      if (!ticketChannel || !(ticketChannel instanceof TextChannel)) {
        return interaction.reply({
          content: '❌ Ticket channel not found or invalid.',
          ephemeral: true,
        });
      }

      // Create thread with username and reason
      const threadName = `${user.username}-${reason.replace(/_/g, '-')}`;
      const thread = await ticketChannel.threads.create({
        name: threadName,
        autoArchiveDuration: 60, // 1 hour (adjust as needed)
        reason: `Ticket created for ${user.tag}: ${reason}`,
      });

      await thread.members.add(user.id);

      // Post intro message with buttons inside the thread (reuse your helper)
      const ticketId = Date.now() % 100000; // simple ticket ID
      await postTicketIntro(thread, user.tag, reason, ticketId);

      // Confirm to user and remove dropdown
      return interaction.update({
        content: `✅ Your ticket thread has been created: <#${thread.id}>`,
        components: [],
      });
    }
  },
};
