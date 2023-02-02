const { Event } = require("../../../../Global/Structures/Default.Events");
const chalk = require('chalk');
const { GatewayIntentBits, Client } = require("discord.js")

class ready extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            enabled: true,
        });
    }

    async onLoad() {

        setInterval(async () => {
            const aris = await ariscik.findOne({ guildID: system.Guild.ID })
            const voice = require("@discordjs/voice")
            const channel = client.channels.cache.get(aris?.botVoiceChannel);
            voice.joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfMute: true,
            });
        }, 1000 * 3)

        const tokens = [
            system.Tokens.Executive,
            system.Tokens.ExecutivePlus,
            system.Tokens.GuardI,
            system.Tokens.GuardII,
            system.Tokens.GuardIII,
            system.Tokens.GuardIV,
            ...system.Tokens.DistTokens
        ]
        tokens.forEach(async (token) => {
            const botClient = new Client({
                intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent],
                presence: {
                    activities: [{
                        name: "ARIS",
                        type: "LISTENING"
                    }],
                    status: "offline",
                },
            });

            botClient.on("ready", async () => {
                const aris = await ariscik.findOne({ guildID: system.Guild.ID })
                if (!aris?.Full.includes(botClient.user.id)) {
                    await ariscik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { Full: botClient.user.id } }, { upsert: true })
                    await ariscik.findOneAndUpdate({ guildID: system.Guild.ID }, { $push: { Chat: botClient.user.id } }, { upsert: true })
                } else return;
            });

            await botClient.login(token);
        });

        _status(
            [
                { name: `Porno`, type: 3 }, // İzliyor
                { name: `Am şelalesini`, type: 2 },  // Dinliyor
                { name: `Sikiyle`, type: 0 },  // Bir oyun oynuyor
                { name: `twich`, type: 1, url: "https://twitch.tv/ravgar" }, // Twitch'de yayında
                { name: `Vich ❤️ Ravgar`, type: 5 } // Yarışmada yarışıyor
            ],
            ["dnd", "online", "idle"],
            {
                on: false,
                activities: 5000,
                status: 30000
            }
        )
        console.log(`[${tarihsel(Date.now())}] ${chalk.green.bgHex('#2f3236')(`Başarıyla Giriş Yapıldı: ${client.user.tag}`)}`)


    }
}


function _status(activities, status, time) {
    if (!time.on) {
        client.user.setActivity(activities[4])
        client.user.setStatus(status[0])
    } else {
        let i = 0;
        setInterval(() => {
            if (i >= activities.length) i = 0
            client.user.setActivity(activities[i])
            i++;
        }, time.activities);

        let s = 0;
        setInterval(() => {
            if (s >= activities.length) s = 0
            client.user.setStatus(status[s])
            s++;
        }, time.status);
    }
}
module.exports = ready;