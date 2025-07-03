// import { Client, GatewayIntentBits, Events } from 'discord.js';
// import { config } from './config';
// import { ticketCommand } from './commands/ticket';

// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages
//   ],
// });

// client.once(Events.ClientReady, () => {
//   console.log(`✅ Bot is online as ${client.user?.tag}`);
// });

// client.on(Events.InteractionCreate, async interaction => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === 'ticket') {
//     await ticketCommand.execute(interaction);
//   }
// });

// client.login(config.token);
import { startBot } from './bot';

startBot();
