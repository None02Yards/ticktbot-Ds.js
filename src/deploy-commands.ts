// import { REST, Routes } from 'discord.js';
// import { config } from './config';
// import { ticketCommand } from './commands/general-ticketing/ticket';
// import { registerCommands } from '../src/loadCommands';

// async function deploy() {
//   const rest = new REST({ version: '10' }).setToken(config.token);

//   try {
//     console.log('🚀 Deploying slash commands...');
//     await rest.put(
//       Routes.applicationGuildCommands(config.clientId, config.guildId),
//       { body: [ticketCommand.data.toJSON()] }
//     );
//     console.log('✅ Slash commands deployed!');
//   } catch (err) {
//     console.error('❌ Failed to deploy commands:', err);
//   }
// }
// registerCommands().catch(err => {
//   console.error('Failed to deploy commands:', err);
// });

// deploy();


// src/deploy-commands.ts
import 'dotenv/config';                   // load your .env
import { registerCommands } from './loadCommands';

(async () => {
  try {
    console.log('🚀 Deploying slash commands...');
    await registerCommands();
    console.log('✅ Slash commands deployed!');
  } catch (err) {
    console.error('❌ Failed to deploy commands:', err);
    process.exit(1);
  }
})();
