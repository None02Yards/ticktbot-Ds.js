
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

export default {
  customIdPrefix: 'ticket-', // e.g. ticket-lock, ticket-delete, ticket-close, ticket-rename

  async execute(interaction: ButtonInteraction | ModalSubmitInteraction) {
    // Handle modal submit for rename
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'rename-ticket-modal') {
        const newTitle = interaction.fields.getTextInputValue('renameInput').trim();

        if (newTitle.length < 1 || newTitle.length > 100) {
          return interaction.reply({
            content: '❌ Title must be between 1 and 100 characters.',
            ephemeral: true,
          });
        }

        const thread = interaction.channel;
        if (!thread || !thread.isThread()) {
          return interaction.reply({
            content: '❌ This must be used inside a thread.',
            ephemeral: true,
          });
        }

        try {
          await thread.setName(newTitle);
          await interaction.reply({
            content: `✏️ Thread renamed to: \`${newTitle}\``,
            ephemeral: true,
          });
        } catch (err) {
          console.error('Failed to rename thread:', err);
          await interaction.reply({
            content: '❌ Could not rename the thread.',
            ephemeral: true,
          });
        }
        return;
      }
      return; // Ignore other modals
    }

    // Handle button interaction
    if (!interaction.isButton()) return;

    const { customId, channel, user } = interaction;

    if (!channel || channel.type !== ChannelType.GuildPublicThread) {
      return interaction.reply({
        content: '❌ This action can only be used inside a ticket thread.',
        ephemeral: true,
      });
    }

    const thread = channel as ThreadChannel;

    if (customId === 'lock-ticket') {
      if (thread.locked) {
        return interaction.reply({ content: '⚠️ This thread is already locked.', ephemeral: true });
      }
      try {
        await thread.setLocked(true, `Locked by ${user.tag} via button`);
        await interaction.reply({ content: '🔒 Thread has been locked.', ephemeral: true });
      } catch (err) {
        console.error('Failed to lock thread:', err);
        await interaction.reply({ content: '❌ Failed to lock the thread.', ephemeral: true });
      }
    }

    else if (customId === 'close-ticket') {
      if (thread.archived) {
        return interaction.reply({ content: '⚠️ This thread is already archived.', ephemeral: true });
      }
      try {
        await thread.setArchived(true, `Closed by ${user.tag} via button`);
        await interaction.reply({ content: '📁 Thread has been archived.', ephemeral: true });
      } catch (err) {
        console.error('Failed to archive thread:', err);
        await interaction.reply({ content: '❌ Failed to archive the thread.', ephemeral: true });
      }
    }

    else if (customId === 'delete-ticket') {
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.reply({
          content: '❌ You do not have permission to delete this thread.',
          ephemeral: true,
        });
      }
      try {
        await interaction.reply({ content: '🗑️ Deleting thread...', ephemeral: true });
        await thread.delete('Deleted via ticket button');
      } catch (err) {
        console.error('Failed to delete thread:', err);
        await interaction.reply({ content: '❌ Failed to delete the thread.', ephemeral: true });
      }
    }

    else if (customId === 'rename-ticket') {
      // Show modal for rename input
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
    }

    else {
      await interaction.reply({ content: '❌ Unknown ticket action.', ephemeral: true });
    }
  },
};
