import { Events, ThreadChannel } from 'discord.js';
import { config } from '../../config';

export default {
  name: Events.ThreadCreate,
  once: false,
  async execute(thread: ThreadChannel) {
    // Skip blacklisted guilds
    if (config.guildBlacklist?.includes(thread.guild.id)) return;

    // Example: send a welcome message in new threads (adjust as desired)
    await thread.send(`🆕 Thread **${thread.name}** has been created by <@${thread.ownerId}>.`);
  },
};
