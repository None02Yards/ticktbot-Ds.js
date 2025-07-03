import { Events, GuildMember, EmbedBuilder } from 'discord.js';

export default {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member: GuildMember) {
    // Send a welcome embed to the guild's system channel, if set
    const channel = member.guild.systemChannel;
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle('👋 New Member Joined')
      .setDescription(`Welcome to the server, <@${member.id}>!`)
      .addFields(
        { name: 'Username', value: member.user.tag, inline: true },
        { name: 'Joined At', value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:F>`, inline: true }
      )
      .setThumbnail(member.displayAvatarURL())
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};
