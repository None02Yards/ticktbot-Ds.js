
// import {
//   ChatInputCommandInteraction,
//   Client,
//   Events,
//   Interaction,
//   StringSelectMenuInteraction,
//   ButtonInteraction,
// } from 'discord.js';
// import { Command, loadCommands } from '@/loadCommands';

// const commandMap = new Map<string, Command>();

// export default {
//   name: Events.InteractionCreate,
//   async execute(interaction: Interaction) {
//     // 1. Handle select menu interaction first
//     if (interaction.isStringSelectMenu()) {
//       if (interaction.customId === 'ticketTypeSelector') {
//         const { default: handler } = await import('@/commands/staff/ticket-menu-handler');
//         return handler.execute(interaction as StringSelectMenuInteraction);
//       }
//       // Add other select menus here if needed
//     }

//     // 2. Handle button interactions (optional)
//     if (interaction.isButton()) {
//       if (interaction.customId.startsWith('ticket-')) {
//         const { default: buttonHandler } = await import('@/commands/staff/ticket-button-handler');
//         return buttonHandler.execute(interaction as ButtonInteraction);
//       }
//       // Add other button handlers here if needed
//     }

//     // 3. Handle slash commands only
//     if (!(interaction instanceof ChatInputCommandInteraction)) return;

//     // Load commands once if not loaded already
//     if (!commandMap.size) {
//       const commands = await loadCommands();
//       for (const command of commands) {
//         // Enforce unique command names here if you want
//         if (!commandMap.has(command.data.name)) {
//           commandMap.set(command.data.name, command);
//         } else {
//           console.warn(`Duplicate command ignored: ${command.data.name}`);
//         }
//       }
//     }

//     const cmd = commandMap.get(interaction.commandName);
//     if (!cmd) {
//       // Unknown command, maybe log or ignore silently
//       return;
//     }

//     try {
//       await cmd.execute(interaction);
//     } catch (err) {
//       console.error(`❌ Error running ${interaction.commandName}:`, err);
//       if (!interaction.replied && !interaction.deferred) {
//         await interaction.reply({
//           content: '❌ There was an error executing this command.',
//           ephemeral: true,
//         });
//       }
//     }
//   },
// };

import {
  ChatInputCommandInteraction,
  Client,
  Events,
  Interaction,
  StringSelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';
import { Command, loadCommands } from '@/loadCommands';

const commandMap = new Map<string, Command>();

// Cache handlers to avoid repeated dynamic imports
let ticketMenuHandler: typeof import('@/commands/staff/ticket-menu-handler') | null = null;
let ticketButtonHandler: typeof import('@/commands/staff/ticket-button-handler') | null = null;
let pingButtonHandler: typeof import('commands/ping-button-handler') | null = null;

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    try {
      // Handle select menu interaction (dropdowns)
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'ticketTypeSelector') {
          if (!ticketMenuHandler) {
            ticketMenuHandler = await import('@/commands/staff/ticket-menu-handler');
            console.log('Loaded ticket-menu-handler');
          }
          console.log('Handling ticket type selector');
          return ticketMenuHandler.default.execute(interaction as StringSelectMenuInteraction);
        }
      }

      // Handle button interaction
      if (interaction.isButton()) {
        if (interaction.customId.startsWith('ticket-')) {
          if (!ticketButtonHandler) {
            ticketButtonHandler = await import('@/commands/staff/ticket-button-handler');
            console.log('Loaded ticket-button-handler');
          }
          console.log(`Handling ticket button interaction: ${interaction.customId}`);
          return ticketButtonHandler.default.execute(interaction as ButtonInteraction);
        }

        if (interaction.customId === 'ping-button') {
          if (!pingButtonHandler) {
            pingButtonHandler = await import('commands/ping-button-handler');
            console.log('Loaded ping-button-handler');
          }
          console.log('Handling ping button interaction');
          return pingButtonHandler.default.execute(interaction as ButtonInteraction);
        }
      }

      // Handle modal submit interaction
      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'rename-ticket-modal') {
          if (!ticketButtonHandler) {
            ticketButtonHandler = await import('@/commands/staff/ticket-button-handler');
            console.log('Loaded ticket-button-handler');
          }
          console.log('Handling rename ticket modal submit');
          return ticketButtonHandler.default.execute(interaction as ModalSubmitInteraction);
        }
      }

      // Handle slash commands
      if (!(interaction instanceof ChatInputCommandInteraction)) return;

      if (!commandMap.size) {
        console.log('Loading slash commands...');
        const commands = await loadCommands();
        for (const command of commands) {
          commandMap.set(command.data.name, command);
        }
        console.log(`Loaded ${commandMap.size} commands.`);
      }

      const cmd = commandMap.get(interaction.commandName);
      if (!cmd) {
        console.warn(`No command found for name: ${interaction.commandName}`);
        return;
      }

      console.log(`Executing command: ${interaction.commandName}`);
      await cmd.execute(interaction);
    } catch (error) {
      console.error('Error handling interaction:', error);
      if (
        'replied' in interaction &&
        !interaction.replied &&
        !interaction.deferred
      ) {
        await interaction.reply({
          content: '❌ There was an error executing this interaction.',
          ephemeral: true,
        });
      }
    }
  },
};
