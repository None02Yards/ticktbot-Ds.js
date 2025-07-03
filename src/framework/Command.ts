// src/framework/Command.ts
import { InteractionCommand } from './InteractionCommand';

export namespace Command {
  export type Context = {
    interaction: import('discord.js').ChatInputCommandInteraction;
  };

  export const Interaction = InteractionCommand;
}
