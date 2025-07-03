import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const closeCommand = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Archive the current thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;

    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ This command must be used inside a thread.',
        ephemeral: true,
      });
    }

    try {
      if (thread.archived) {
        return interaction.reply({
          content: '⚠️ This thread is already archived.',
          ephemeral: true,
        });
      }

      await thread.setArchived(true, 'Closed by user command');
      await interaction.reply({
        content: '✅ Thread has been archived.',
        ephemeral: true,
      });
    } catch (err) {
      console.error('Failed to archive thread:', err);
      await interaction.reply({
        content: '❌ Could not archive the thread.',
        ephemeral: true,
      });
    }
  },
};
