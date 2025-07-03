import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN ?? '',
  guildId: process.env.GUILD_ID ?? '',
  ticketChannelId: process.env.TICKET_CHANNEL_ID ?? '',
  guildBlacklist: process.env.GUILD_BLACKLIST?.split(',') ?? [],
  clientId: process.env.CLIENT_ID ?? '',  // ← add this line
};
