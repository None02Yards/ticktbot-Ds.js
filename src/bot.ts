

// src/bot.ts
// src/bot.ts
import 'dotenv/config';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { config } from './config';
import { loadCommands, Command } from './loadCommands';
import { loadEvents } from './loadEvents';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const commandMap = new Map<string, Command>();

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot is online as ${client.user?.tag}`);
});

export async function startBot() {
  const commands = await loadCommands();
  for (const command of commands) {
    commandMap.set(command.data.name, command);
  }

  // Load all event handlers, including interactionCreate event handler
  await loadEvents(client);

  await client.login(config.token);
}

// If this file is run directly, start the bot
if (require.main === module) {
  startBot().catch(err => {
    console.error('Failed to start bot:', err);
    process.exit(1);
  });
}

// Export commandMap for use in event handlers if needed
export { commandMap };

