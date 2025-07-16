// src/commands/ping-button-handler.ts
import { ButtonInteraction } from 'discord.js';

export default {
  async execute(interaction: ButtonInteraction) {
    await interaction.reply({ content: 'Pingo!', ephemeral: true });
  },
};
