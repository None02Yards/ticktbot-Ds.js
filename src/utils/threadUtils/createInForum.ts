import { ForumChannel } from 'discord.js';

export async function createInForum(
  channel: ForumChannel,
  name: string,
  userTag: string,
  reason: string
) {
  return await channel.threads.create({
    name,
    message: {
      content: `New ticket from ${userTag}\n**Reason:** ${reason}`,
    },
  });
}
