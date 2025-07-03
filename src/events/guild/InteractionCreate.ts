import { Events, Interaction } from 'discord.js';
import { config } from '../../config';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    // Only block guild interactions
    if (!interaction.inGuild()) return;

    // Ensure config.guildBlacklist is an array of guild IDs
    if (config.guildBlacklist?.includes(interaction.guildId!)) {
      console.log(`Blocked interaction in blacklisted guild ${interaction.guildId}`);
      return;
    }

    // (Further interaction handling happens elsewhere via your command loader)
  },
};
