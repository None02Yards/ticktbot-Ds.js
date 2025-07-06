// src/utils/ticketUtils.ts
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ThreadChannel,
} from 'discord.js';

export async function postTicketIntro(
  thread: ThreadChannel,
  userTag: string,
  reason: string,
  ticketId: number
) {
  const embed = new EmbedBuilder()
    .setTitle(`🎫 Ticket #${ticketId.toString().padStart(4, '0')}`)
    .setDescription(`**User:** ${userTag}\n**Reason:** ${reason}`)
    .addFields(
      { name: 'Status',  value: '🟢 Open', inline: true },
      { name: 'Created', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
    )
    .setColor(0x00AE86)
    .setFooter({ text: `Ticket ID: ${ticketId}` })
    .setTimestamp();

  const actions = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('lock-ticket')
      .setLabel('🔒 Lock')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('close-ticket')
      .setLabel('📁 Close')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('delete-ticket')
      .setLabel('🗑️ Delete')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('rename-ticket')
      .setLabel('✏️ Rename')
      .setStyle(ButtonStyle.Secondary),
  );

  await thread.send({ embeds: [embed], components: [actions] });
}
