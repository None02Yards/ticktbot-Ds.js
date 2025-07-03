import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const autoreplyCommand = {
  data: new SlashCommandBuilder()
    .setName('auto-reply')
    .setDescription('Send a greeting in this forum thread'),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;

    if (!thread?.isThread()) {
      return interaction.reply({
        content: '❌ Use this command inside a forum thread.',
        ephemeral: true,
      });
    }

    await thread.send(`👋 Hi <@${thread.ownerId}>! Thanks for your post. Support will respond shortly.`);
    await interaction.reply({ content: '✅ Auto-reply sent.', ephemeral: true });
  },
};
