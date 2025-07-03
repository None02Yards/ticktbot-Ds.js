import { Events, GuildMember, EmbedBuilder } from 'discord.js';

export default {
  name: Events.GuildMemberRemove,
  once: false,
  async execute(member: GuildMember) {
    // Send a farewell embed to the guild's system channel, if set
    const channel = member.guild.systemChannel;
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle('👋 Member Left')
      .setDescription(`${member.user.tag} has left the server.`)
      .addFields(
        { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true }
      )
      .setThumbnail(member.displayAvatarURL())
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};
