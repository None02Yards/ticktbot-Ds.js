import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const converttoticketCommand = {
  data: new SlashCommandBuilder()
    .setName('convert-to-ticket')
    .setDescription('Convert this forum post into a ticket thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;

    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ This must be used inside a forum thread.',
        ephemeral: true,
      });
    }

    const newName = `ticket-${interaction.user.username}`;

    await thread.setName(newName);
    await thread.send(`📌 This thread has been converted to a support ticket by <@${interaction.user.id}>.`);
    await interaction.reply({ content: `✅ Renamed thread to \`${newName}\``, ephemeral: true });
  },
};
