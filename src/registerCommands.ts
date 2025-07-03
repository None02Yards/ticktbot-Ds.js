import { REST, Routes } from 'discord.js';
import { config } from './config';
import { ticketCommand } from './commands/general-ticketing/ticket';

export async function registerSlashCommands() {
  const rest = new REST({ version: '10' }).setToken(config.token);

  await rest.put(
    Routes.applicationGuildCommands(config.clientId!, config.guildId),
    { body: [ticketCommand.data.toJSON()] }
  );

  console.log('✅ Slash commands registered.');
}
