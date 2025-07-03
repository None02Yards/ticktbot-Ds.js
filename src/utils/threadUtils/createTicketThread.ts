import {
  GuildTextBasedChannel,
  TextChannel,
  NewsChannel,
  ForumChannel,
} from 'discord.js';
import { createInTextOrNews } from './createInTextOrNews';
import { createInForum } from './createInForum';

export async function createTicketThread(
  channel: GuildTextBasedChannel,
  userTag: string,
  reason: string
) {
  const name = `ticket-${userTag.replace(/#/, '').replace(/\s/g, '-')}`;

  if (channel instanceof TextChannel || channel instanceof NewsChannel) {
    return await createInTextOrNews(channel, name, reason);
  }

  if (channel instanceof ForumChannel) {
    return await createInForum(channel, name, userTag, reason);
  }

  throw new Error('Unsupported channel type for ticket threads.');
}
