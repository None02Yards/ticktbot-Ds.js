
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

// src/events/client/interactionCreate.ts
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

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    // 1. Handle select menu interaction (dropdowns)
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'ticketTypeSelector') {
        const { default: handler } = await import('@/commands/staff/ticket-menu-handler');
        return handler.execute(interaction as StringSelectMenuInteraction);
      }
    }

    // 2. Handle button interaction
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('ticket-')) {
        const { default: buttonHandler } = await import('@/commands/staff/ticket-button-handler');
        return buttonHandler.execute(interaction as ButtonInteraction);
      }
    }

    // 3. Handle modal submit interaction
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'rename-ticket-modal') {
        const { default: buttonHandler } = await import('@/commands/staff/ticket-button-handler');
        return buttonHandler.execute(interaction as ModalSubmitInteraction);
      }
    }

    // 4. Handle slash commands
    if (!(interaction instanceof ChatInputCommandInteraction)) return;

    // Load commands once if not loaded already
    if (!commandMap.size) {
      const commands = await loadCommands();
      for (const command of commands) {
        commandMap.set(command.data.name, command);
      }
    }

    const cmd = commandMap.get(interaction.commandName);
    if (!cmd) return;

    try {
      await cmd.execute(interaction);
    } catch (err) {
      console.error(`❌ Error running ${interaction.commandName}:`, err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ There was an error executing this command.',
          ephemeral: true,
        });
      }
    }
  },
};
