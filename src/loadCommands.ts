import { REST, Routes, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { config } from './config';
import path from 'path';
import { readdirSync, statSync } from 'fs';

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

// Recursively walk the commands folder and collect Command exports
async function walkDir(dir: string, commands: Command[]): Promise<void> {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      await walkDir(fullPath, commands);
    } else if (entry.endsWith('.ts') || entry.endsWith('.js')) {
      const relativePath = path
        .relative(__dirname, fullPath)
        .replace(/\\/g, '/')
        .replace(/\.ts$/, '');

      try {
        const mod = await import(`./${relativePath}`);
        const cmd = (Object.values(mod)[0]) as Command;

        if (
          cmd &&
          cmd.data instanceof SlashCommandBuilder &&
          typeof cmd.execute === 'function'
        ) {
          commands.push(cmd);
        }
      } catch (err) {
        console.error(`❌ Failed to load command from ${entry}:`, err);
      }
    }
  }
}

/**
 * Loads all commands under src/commands/** and returns unique commands.
 */
export async function loadCommands(): Promise<Command[]> {
  const allCommands: Command[] = [];
  const commandsPath = path.join(__dirname, 'commands');
  await walkDir(commandsPath, allCommands);

  const uniqueCommands: Command[] = [];
  const commandNames = new Set<string>();

  for (const cmd of allCommands) {
    if (commandNames.has(cmd.data.name)) {
      console.warn(`Duplicate command name skipped: ${cmd.data.name}`);
      continue; // skip duplicate
    }
    commandNames.add(cmd.data.name);
    uniqueCommands.push(cmd);
  }

  return uniqueCommands;
}

/**
 * Registers all unique commands with Discord via the REST API.
 */
export async function registerCommands(): Promise<void> {
  const commands = await loadCommands();
  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    console.log(`📦 Registering ${commands.length} unique slash commands...`);
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands.map(cmd => cmd.data.toJSON()) }
    );
    console.log(`✅ Successfully registered ${commands.length} commands.`);
  } catch (err) {
    console.error('❌ Slash command registration failed:', err);
  }

  console.log('Loaded commands:', commands.map(cmd => cmd.data.name));
}
