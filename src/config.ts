import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN ?? '',
  guildId: process.env.GUILD_ID ?? '',
  ticketChannelId: process.env.TICKET_CHANNEL_ID ?? '',
  guildBlacklist: process.env.GUILD_BLACKLIST?.split(',') ?? [],
  clientId: process.env.CLIENT_ID ?? '',  
   billingChannelId: process.env.BILLING_CHANNEL_ID!,
  reportsChannelId: process.env.REPORTS_CHANNEL_ID!,
  ticketLogChannelId: process.env.TICKET_LOG_CHANNEL_ID!,
    generalSupportChannelId: process.env.GENERAL_SUPPORT_CHANNEL_ID!,
};
