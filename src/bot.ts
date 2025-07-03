// src/bot.ts
import 'dotenv/config';
import { Client, GatewayIntentBits, Events, ChatInputCommandInteraction } from 'discord.js';
import { config } from './config';
import { loadCommands, Command } from './loadCommands';

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

client.on(Events.InteractionCreate, async interaction => {
  if (!(interaction instanceof ChatInputCommandInteraction)) return;

  const cmd = commandMap.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error(`❌ Error running ${interaction.commandName}:`, err);
    await interaction.reply({ content: '❌ There was an error executing this command.', ephemeral: true });
  }
});

export async function startBot() {
  const commands = await loadCommands();
  for (const command of commands) {
    commandMap.set(command.data.name, command);
  }
  await client.login(config.token);
}
if (require.main === module) {
  startBot().catch(err => {
    console.error('Failed to start bot:', err);
    process.exit(1);
  });
}