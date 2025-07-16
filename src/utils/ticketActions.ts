// src/utils/ticketActions.ts
import { ThreadChannel } from 'discord.js';

export async function lockThread(thread: ThreadChannel, userTag: string) {
  if (thread.locked) {
    throw new Error('This thread is already locked.');
  }
  await thread.setLocked(true, `Locked by ${userTag}`);
}

export async function closeThread(thread: ThreadChannel, userTag: string) {
  if (thread.archived) {
    throw new Error('This thread is already archived.');
  }
  await thread.setArchived(true, `Closed by ${userTag}`);
}

export async function deleteThread(thread: ThreadChannel, reason?: string) {
  await thread.delete(reason ?? 'Deleted via command');
}


export async function renameThread(thread: ThreadChannel, newTitle: string) {
  if (newTitle.length < 1 || newTitle.length > 100) {
    throw new Error('Title must be between 1 and 100 characters.');
  }
  await thread.setName(newTitle);
}
