import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';

export const pingCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with a button'),

  async execute(interaction: ChatInputCommandInteraction) {
    const button = new ButtonBuilder()
      .setCustomId('ping-button')
      .setLabel('Click Me')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await interaction.reply({
      content: 'Press the button below!',
      components: [row],
      ephemeral: false,
    });
  },
};
