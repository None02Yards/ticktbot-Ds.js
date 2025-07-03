import {
  TextChannel,
  NewsChannel,
  ThreadAutoArchiveDuration,
} from 'discord.js';

export async function createInTextOrNews(
  channel: TextChannel | NewsChannel,
  name: string,
  reason: string
) {
  return await channel.threads.create({
    name,
    autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
    reason,
  });
}
