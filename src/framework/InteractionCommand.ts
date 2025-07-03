// src/framework/InteractionCommand.ts
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  GuildMember,
  User,
} from 'discord.js';

export abstract class InteractionCommand {
  public abstract data: SlashCommandBuilder;
  public abstract execute(ctx: { interaction: ChatInputCommandInteraction }): Promise<void>;

  protected get SlashBuilder() {
    return new SlashCommandBuilder();
  }

  protected userEmbed(member: GuildMember | User): EmbedBuilder {
    return new EmbedBuilder().setAuthor({
      name: '👤 ' + ('displayName' in member ? member.displayName : member.username),
      iconURL: member.displayAvatarURL(),
    });
  }

  protected userEmbedError(member: GuildMember | User, title: string): EmbedBuilder {
    return this.userEmbed(member).setTitle(title).setColor(0xff0000);
  }
}
