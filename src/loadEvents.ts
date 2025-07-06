// src/loadEvents.ts
import path from 'path';
import { readdirSync, statSync } from 'fs';
import { Client, Events } from 'discord.js';

interface EventHandler {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => Promise<void> | void;
}

async function walkDir(dir: string, client: Client): Promise<void> {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      await walkDir(fullPath, client);
    } else if (entry.endsWith('.ts') || entry.endsWith('.js')) {
      try {
        const mod = await import(fullPath);
        const handler: EventHandler = mod.default || mod;

        if (!handler || !handler.name || typeof handler.execute !== 'function') continue;

        if (handler.once) {
          client.once(handler.name, (...args) => handler.execute(...args));
        } else {
          client.on(handler.name, (...args) => handler.execute(...args));
        }
      } catch (err) {
        console.error(`Failed to load event from ${entry}:`, err);
      }
    }
  }
}

export async function loadEvents(client: Client): Promise<void> {
  const eventsPath = path.join(__dirname, 'events');
  await walkDir(eventsPath, client);
}
