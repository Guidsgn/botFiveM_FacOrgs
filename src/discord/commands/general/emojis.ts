import { Command } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType, Attachment, AttachmentBuilder } from "discord.js";

new Command({
    name: "emojis",
    description: "Comando para Obter Emojis",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "servidor",
            description: "Obter Emojis do Servidor",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "geral",
            description: "Obter Emojis Globais",
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    async run(interaction){
        const { options, client, guild } = interaction;

        interface Emojis {
            static: Record<string, string>
            animated: Record<string, string>
        };
        const emojis: Emojis = { static: {}, animated: {} };

        const subcommand = options.getSubcommand(true);
        switch(subcommand){
            case "bot":
            case "servidor":{
                const emojisCache = subcommand === "bot"
                ? client.emojis.cache
                : guild.emojis.cache;

                for(const { name, id, animated } of emojisCache.values()){
                    if(!name) continue;
                    emojis[animated ? "animated" : "static"][name] = id;
                }

                const buffer = Buffer.from(JSON.stringify(emojis, null, 2), "utf-8");
                const attachment = new AttachmentBuilder(buffer, { name: "emojis.json" });

                interaction.reply({
                    ephemeral, files: [attachment],
                    content: `Emojis do ${subcommand}`
                });
            }
        }
    }
});