import path from 'path';
import { readdirSync, statSync } from 'fs';
import { Client } from 'discord.js';

interface Event {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => void;
}

async function walkEvents(dir: string, client: Client) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      await walkEvents(fullPath, client);
    } else if (entry.endsWith('.ts') || entry.endsWith('.js')) {
      const relativePath = path.relative(__dirname, fullPath).replace(/\\/g, '/').replace(/\.ts$/, '');
      try {
        const { event } = await import(`./${relativePath}`);
        if (event?.name && typeof event.execute === 'function') {
          if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
          } else {
            client.on(event.name, (...args) => event.execute(...args));
          }
        }
      } catch (err) {
        console.error(`❌ Failed to load event from ${entry}:`, err);
      }
    }
  }
}

export async function loadEvents(client: Client) {
  const eventsPath = path.join(__dirname, 'events');
  await walkEvents(eventsPath, client);
}
