// // src/commands/general-ticketing/ticket.ts
// import {
//   ChatInputCommandInteraction,
//   SlashCommandBuilder,
//   TextChannel,
// } from 'discord.js';
// import { config } from '../../config';
// import { createTicketThread } from '../../utils/threadUtils/createTicketThread';
// import { postTicketIntro } from '../../utils/ticketUtils';

// export const ticketCommand = {
//   data: new SlashCommandBuilder()
//     .setName('ticket')
//     .setDescription('Create a support ticket')
//     .addStringOption(option =>
//       option
//         .setName('reason')
//         .setDescription('Reason for the ticket')
//         .setRequired(true)
//     ),

//   async execute(interaction: ChatInputCommandInteraction) {
//     const reason = interaction.options.getString('reason', true);
//     const userTag = interaction.user.tag;

//     // 1) Fetch & validate the ticket channel
//     const rawChannel = interaction.guild?.channels.cache.get(
//       config.ticketChannelId
//     );
//     if (!(rawChannel instanceof TextChannel)) {
//       return interaction.reply({
//         content: '❌ Ticket channel is not a text channel.',
//         ephemeral: true,
//       });
//     }

//     // 2) Create the private ticket thread
//     const thread = await createTicketThread(rawChannel, userTag, reason);
//     await thread.members.add(interaction.user.id);

//     // 3) Post the embedded intro + action buttons
//     // TODO: Replace this placeholder with a real ticket‐ID generator
//     const ticketId = Date.now() % 100000;
//     await postTicketIntro(thread, userTag, reason, ticketId);

//     // 4) Confirm creation to the user
//     await interaction.reply({
//       content: `✅ Your ticket has been created: <#${thread.id}>`,
//       ephemeral: true,
//     });
//   },
// };

// src/commands/general-ticketing/ticket.ts
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { config } from '../../config';
import { createTicketThread } from '../../utils/threadUtils/createTicketThread';
import { postTicketIntro } from '../../utils/ticketUtils';

export const ticketCommand = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create a support ticket')
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for the ticket')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const reason = interaction.options.getString('reason', true);
    const userTag = interaction.user.tag;

    // 1) Fetch & validate the ticket channel
    const rawChannel = interaction.guild?.channels.cache.get(config.ticketChannelId);
    if (!(rawChannel instanceof TextChannel)) {
      return interaction.reply({
        content: '❌ Ticket channel is not a text channel.',
        ephemeral: true,
      });
    }

    // 2) Create the private ticket thread
    const thread = await createTicketThread(rawChannel, userTag, reason);
    await thread.members.add(interaction.user.id);

    // 3) Post the embedded intro + action buttons
    const ticketId = Date.now() % 100000; // simple ticket ID generator, customize as needed
    await postTicketIntro(thread, userTag, reason, ticketId);

    // 4) Confirm creation to the user
    await interaction.reply({
      content: `✅ Your ticket has been created: <#${thread.id}>`,
      ephemeral: true,
    });
  },
};
