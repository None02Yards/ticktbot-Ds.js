import { ButtonInteraction } from 'discord.js';

export default {
  customIdPrefix: 'ping-', // can be anything

  async execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'ping-button') {
      try {
        // Acknowledge immediately to avoid "Interaction Failed"
        await interaction.deferReply({ ephemeral: true });
        // Send your response
        await interaction.editReply('Pingo!');
      } catch (err) {
        console.error('Error handling ping button:', err);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ content: '❌ Something went wrong.', ephemeral: true });
        }
      }
    }
  },
};
