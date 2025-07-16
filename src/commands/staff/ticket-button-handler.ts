
// src/commands/staff/ticket-button-handler.ts
import {
  ButtonInteraction,
  ChannelType,
  PermissionsBitField,
  ThreadChannel,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalSubmitInteraction,
} from 'discord.js';

import { lockThread, closeThread, deleteThread, renameThread } from '../../utils/ticketActions';

export default {
  customIdPrefix: 'ticket-',

  async execute(interaction: ButtonInteraction | ModalSubmitInteraction) {
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'rename-ticket-modal') {
        const newTitle = interaction.fields.getTextInputValue('renameInput').trim();
        const thread = interaction.channel;

        if (!thread || !thread.isThread()) {
          return interaction.reply({ content: '❌ This must be used inside a thread.', ephemeral: true });
        }

        try {
          await renameThread(thread, newTitle);
          await interaction.reply({ content: `✏️ Thread renamed to: \`${newTitle}\``, ephemeral: true });
        } catch (err: any) {
          await interaction.reply({ content: `❌ ${err.message}`, ephemeral: true });
        }
        return;
      }
      return;
    }

    if (!interaction.isButton()) return;

    const { customId, channel, user } = interaction;
    if (!channel || channel.type !== ChannelType.GuildPublicThread) {
      return interaction.reply({ content: '❌ This action can only be used inside a ticket thread.', ephemeral: true });
    }
    const thread = channel as ThreadChannel;

    try {
      if (customId === 'lock-ticket') {
        await lockThread(thread, user.tag);
        await interaction.reply({ content: '🔒 Thread has been locked.', ephemeral: true });
      } else if (customId === 'close-ticket') {
        await closeThread(thread, user.tag);
        await interaction.reply({ content: '📁 Thread has been archived.', ephemeral: true });
      } else if (customId === 'delete-ticket') {
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels)) {
          return interaction.reply({ content: '❌ You do not have permission to delete this thread.', ephemeral: true });
        }
        await interaction.reply({ content: '🗑️ Deleting thread...', ephemeral: true });
        await deleteThread(thread, user.tag);
      } else if (customId === 'rename-ticket') {
        // Show rename modal
        const modal = new ModalBuilder()
          .setCustomId('rename-ticket-modal')
          .setTitle('Rename Ticket Thread');

        const renameInput = new TextInputBuilder()
          .setCustomId('renameInput')
          .setLabel('New Thread Title')
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(100)
          .setPlaceholder('Enter the new thread title')
          .setRequired(true);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(renameInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
      } else {
        await interaction.reply({ content: '❌ Unknown ticket action.', ephemeral: true });
      }
    } catch (err: any) {
      console.error(`Failed to process ticket action ${customId}:`, err);
      await interaction.reply({ content: `❌ ${err.message}`, ephemeral: true });
    }
  },
};
