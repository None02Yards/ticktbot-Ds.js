import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

export const renameTitleCommand = {
  data: new SlashCommandBuilder()
    .setName('rename-title')
    .setDescription('Rename the current thread title')
    .addStringOption(option =>
      option
        .setName('new_title')
        .setDescription('New name for the thread')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;
    const newTitle = interaction.options.getString('new_title', true);

    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ This command must be used inside a thread.',
        ephemeral: true,
      });
    }

    if (newTitle.length < 1 || newTitle.length > 100) {
      return interaction.reply({
        content: '⚠️ Title must be between 1 and 100 characters.',
        ephemeral: true,
      });
    }

    try {
      await thread.setName(newTitle);
      await interaction.reply({
        content: `✅ Thread renamed to: \`${newTitle}\``,
        ephemeral: true,
      });
    } catch (err) {
      console.error('Failed to rename thread:', err);
      await interaction.reply({
        content: '❌ Could not rename the thread.',
        ephemeral: true,
      });
    }
  },
};
