
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { ChannelType, PermissionsBitField } = require("discord.js")
class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            description: "Sunucu içerisi detaylı bilgileri öğrenmenizi sağlar.",
            usage: "say",
            category: "Misc",
            aliases: ["sy"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        const detay = new Discord.ButtonBuilder().setCustomId("detayses").setLabel("Detaylı Ses").setEmoji("989480389053661188").setStyle(Discord.ButtonStyle.Primary).setDisabled(true);
        const row = new Discord.ActionRowBuilder().addComponents([detay])
        let say = await message.channel.send({
            components: [row], embeds: [embed.setDescription(`
Sunucumuzda toplam ${global.numberEmojis(message.guild.memberCount)} kişi bulunmakta.
Sunucumuz da ${global.numberEmojis(message.guild.members.cache.filter(u => u.presence && u.presence.status !== "offline").size)} aktif kişi bulunmakta.       
Ses kanallarında ${global.numberEmojis(message.guild.channels.cache.filter(channel => channel.type == ChannelType.GuildVoice).map(channel => channel.members.size).reduce((a, b) => a + b))} adet kullanıcı bulunmaktadır.
Toplam ${global.numberEmojis(message.guild.members.cache.filter(x => aris?.tags.some(tag => x.user.tag.includes(tag))).size)} taglı üyemiz bulunmakta! 
`)]
        })
        var filter = (button) => button.user.id === message.author.id;
        const collector = say.createMessageComponentCollector({ filter })
        collector.on('collect', async (button, user) => {
            button.reply({
                embeds: [embed.setDescription(`
Public ses kanallarında : ${global.numberEmojis()} kişi bulunmakta!

Streamer ses kanallarında : ${global.numberEmojis()} kişi bulunmakta!

Register ses kanallarında : ${global.numberEmojis()} kişi bulunmakta!

Toplam ses kanallarında : ${global.numberEmojis()} taglı kişi bulunmakta!

                `)]
            })
        })
    }
}

module.exports = Say
