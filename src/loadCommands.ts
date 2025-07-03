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
      // Compute the module path relative to this file
      const relativePath = path
        .relative(__dirname, fullPath)
        .replace(/\\/g, '/')
        .replace(/\.ts$/, '');

      try {
        const mod = await import(`./${relativePath}`);
        // Assume the command export is the first value in the module
        const cmd = (Object.values(mod)[0]) as Command;

        // Validate shape before pushing
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
 * Loads all commands under src/commands/** and returns them.
 */
export async function loadCommands(): Promise<Command[]> {
  const commands: Command[] = [];
  const commandsPath = path.join(__dirname, 'commands');
  await walkDir(commandsPath, commands);
  return commands;
}

/**
 * Registers all loaded commands with Discord via the REST API.
 */
export async function registerCommands(): Promise<void> {
  const commands = await loadCommands();
  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    console.log(`📦 Registering ${commands.length} slash commands...`);
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands.map(cmd => cmd.data.toJSON()) }
    );
    console.log(`✅ Successfully registered ${commands.length} commands.`);
  } catch (err) {
    console.error('❌ Slash command registration failed:', err);
  }
}
