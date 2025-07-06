
// src/commands/staff/create-ticket.ts
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('create-ticket')
  .setDescription('Open the ticket creation menu');

export async function execute(interaction: ChatInputCommandInteraction) {
  const select = new StringSelectMenuBuilder()
    .setCustomId('ticketTypeSelector')
    .setPlaceholder('Select the type of ticket to create...')
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
        description: 'Report a server member (They must be in the server!)',
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
        description: 'Have a warning you want to appeal? Click me',
        emoji: '👮‍♂️',
      },
      {
        label: 'Contact NTTS',
        value: 'contact_ntts',
        description: 'Private video ideas, important stuff.',
        emoji: '🧠',
      }
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

  await interaction.reply({
    content: '**Contact the Staff Team**\n\nUsing the drop down below, select the option you believe fits your concern.',
    components: [row],
    ephemeral: true,
  });
}
