import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const deleteCommand = {
  data: new SlashCommandBuilder()
    .setName('delete-thread')
    .setDescription('Delete the current thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;

    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ This command must be used inside a thread.',
        ephemeral: true,
      });
    }

    try {
      await interaction.reply({
        content: '⚠️ Deleting this thread...',
        ephemeral: true,
      });

      await thread.delete('Thread deleted via command');
    } catch (err) {
      console.error('Failed to delete thread:', err);
      await interaction.followUp({
        content: '❌ Could not delete the thread.',
        ephemeral: true,
      });
    }
  },
};
