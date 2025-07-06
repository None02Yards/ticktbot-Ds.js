// src/utils/send-ticket-setup.ts
import { Client, GatewayIntentBits, TextChannel, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import 'dotenv/config';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);

  const channel = await client.channels.fetch(process.env.TICKET_CHANNEL_ID!);
  if (!channel || !channel.isTextBased()) {
    console.error('❌ Invalid channel');
    process.exit(1);
  }

  const embed = new EmbedBuilder()
    .setTitle('📩 Contact the Staff Team')
    .setDescription(
      [
        '**• Member Reports**',
        '> Report a server member! Note they have to be in the server!',
        '',
        '**• Server Inquiries**',
        '> Ask general questions about the server!',
        '',
        '**• Moderation Appeals**',
        '> Have a case you\'d like to appeal? This is the category you want!',
        '',
        '**• Report NSFW Content**',
        '> Choose this option if your ticket involves anything 18+',
        '',
        '**• Contact NTTS**',
        '> Choose this option for instructions to DM NTTS',
      ].join('\n')
    )
    .setColor(0x2b2d31);

  const menu = new StringSelectMenuBuilder()
    .setCustomId('ticketTypeSelector')
    .setPlaceholder('Select the type of ticket to create...')
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel('Report NSFW Content')
        .setValue('report_nsfw')
        .setDescription('Choose this option if your ticket involves anything 18+')
        .setEmoji('🔞'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Member Reports')
        .setValue('member_report')
        .setDescription('Report a server member (They must be in the server!)')
        .setEmoji('📛'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Server Inquiries')
        .setValue('server_inquiry')
        .setDescription('Ask a question about the server')
        .setEmoji('❓'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Moderation Appeals')
        .setValue('mod_appeal')
        .setDescription('Have a warning you want to appeal? Click me')
        .setEmoji('👮‍♂️'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Contact NTTS')
        .setValue('contact_ntts')
        .setDescription('Private video ideas, important stuff.')
        .setEmoji('🧠')
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

  await (channel as TextChannel).send({
    embeds: [embed],
    components: [row],
  });

  console.log('✅ Ticket panel message sent!');
  process.exit(0);
});

client.login(process.env.TOKEN);
