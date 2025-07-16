
// src/commands/staff/create-ticket.ts
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('Create a ticket (normal or threaded)');

export async function execute(interaction: ChatInputCommandInteraction) {
  const select = new StringSelectMenuBuilder()
    .setCustomId('ticketTypePrimarySelector')
    .setPlaceholder('Choose ticket type')
    .addOptions(
      {
        label: 'Normal Ticket',
        description: 'Create a single message ticket (no thread)',
        value: 'normal_ticket',
        emoji: '📩',
      },
      {
        label: 'Threaded Ticket',
        description: 'Create a ticket as a private thread',
        value: 'threaded_ticket',
        emoji: '🧵',
      }
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

  await interaction.reply({
    content: 'Select the type of ticket you want to create:',
    components: [row],
    ephemeral: true,
  });
}

