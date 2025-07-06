
// /media/right/New Volume/ticktdiscord/src/commands/general-ticketing/rename-title.ts
import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import { config } from '../../config';

export const renameTicketTitleCommand = {
  data: new SlashCommandBuilder()
    .setName('rename-ticket')
    .setDescription('Rename your open ticket thread')
    .addStringOption(option =>
      option.setName('new_title')
        .setDescription('New thread title (1–100 characters)')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const newTitle = interaction.options.getString('new_title', true);
    const user = interaction.user;
    const channel = interaction.guild?.channels.cache.get(config.ticketChannelId) as TextChannel;

    const thread = channel?.threads.cache.find(
      (t) => t.name.includes(user.username) && !t.archived
    );

    if (!thread) {
      return interaction.reply({ content: '⚠️ No active thread to rename.', ephemeral: true });
    }

    if (newTitle.length < 1 || newTitle.length > 100) {
      return interaction.reply({ content: '❌ Title must be 1–100 characters.', ephemeral: true });
    }

    try {
      await thread.setName(newTitle);
      await interaction.reply({ content: `✏️ Thread renamed to: \`${newTitle}\``, ephemeral: true });
    } catch (err) {
      console.error('Failed to rename thread:', err);
      await interaction.reply({ content: '❌ Could not rename the thread.', ephemeral: true });
    }
  },
};
