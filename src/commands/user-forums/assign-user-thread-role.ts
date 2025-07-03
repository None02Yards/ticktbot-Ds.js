import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const assignuserthreadroleCommand = {
  data: new SlashCommandBuilder()
    .setName('assign-user-thread-role')
    .setDescription('Give a role to the thread owner')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to assign')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const thread = interaction.channel;
    const role = interaction.options.getRole('role', true);

    if (!thread?.isThread() || !thread.ownerId) {
      return interaction.reply({
        content: '❌ You must run this inside a valid forum thread.',
        ephemeral: true,
      });
    }

    const member = await interaction.guild?.members.fetch(thread.ownerId);
    if (!member) {
      return interaction.reply({ content: '⚠️ Thread owner not found.', ephemeral: true });
    }

    await member.roles.add(role.id);
    await interaction.reply({
      content: `✅ Assigned <@&${role.id}> to <@${member.id}>.`,
      ephemeral: true,
    });
  },
};
