import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const lockCommand = {
  data: new SlashCommandBuilder()
    .setName('lock-thread')
    .setDescription('Lock the current thread (make it read-only)'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;

    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ This command must be used inside a thread.',
        ephemeral: true,
      });
    }

    try {
      if (thread.locked) {
        return interaction.reply({
          content: '⚠️ This thread is already locked.',
          ephemeral: true,
        });
      }

      await thread.setLocked(true, 'Locked via /lock command');

      await interaction.reply({
        content: '🔒 Thread has been locked (read-only).',
        ephemeral: true,
      });
    } catch (err) {
      console.error('Failed to lock thread:', err);
      await interaction.reply({
        content: '❌ Could not lock the thread.',
        ephemeral: true,
      });
    }
  },
};
