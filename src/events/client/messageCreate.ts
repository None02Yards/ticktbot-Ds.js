import { Events, Message } from 'discord.js';

export default {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return;

    if (message.content === '!hello') {
      await message.reply('Hello! 👋');
    }

    if (message.content === '!help') {
      await message.reply('📖 Available commands: `!hello`, `!ping`, `!info`, `!ticket`');
    }

    if (message.content === '!ticket') {
      await message.reply('🎫 Please use the `/ticket` slash command to open a support thread.');
    }
  },
};

