// src/events/client/ready.ts
import { Client } from 'discord.js';

export const event = {
  name: 'ready',
  once: true,
  async execute(client: Client) {
    console.log(`✅ Bot is online as ${client.user?.tag}`);
  },
};
