import { TextChannel, ThreadAutoArchiveDuration } from 'discord.js';

export async function createTicketThread(channel: TextChannel, userTag: string, reason: string)
 {
  const threadName = `ticket-${userTag.replace(/#/, '').replace(/\s/g, '-')}`;
  return await channel.threads.create({
    name: threadName,
    autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
    reason: `Ticket opened: ${reason}`,
  });
}
