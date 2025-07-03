import { ChatInputCommandInteraction, SlashCommandBuilder, ForumChannel } from 'discord.js';

export const tagticketCommand = {
  data: new SlashCommandBuilder()
    .setName('tag-ticket')
    .setDescription('Apply a tag to this forum thread')
    .addStringOption(option =>
      option.setName('tag')
        .setDescription('Tag name to apply (must match exactly)')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;

    if (!thread?.isThread() || thread.parent?.type !== 15) {
      return interaction.reply({
        content: '❌ This command must be used inside a forum thread.',
        ephemeral: true,
      });
    }

    const tagName = interaction.options.getString('tag', true);
    const forum = thread.parent as ForumChannel;

    const tag = forum.availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());

    if (!tag) {
      return interaction.reply({
        content: `⚠️ Tag "${tagName}" not found in this forum.`,
        ephemeral: true,
      });
    }

    await thread.setAppliedTags([tag.id]);
    await interaction.reply({ content: `🏷️ Tag "${tag.name}" applied to this thread.`, ephemeral: true });
  },
};
