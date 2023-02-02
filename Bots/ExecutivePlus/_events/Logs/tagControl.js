const { Event } = require("../../../../Global/Structures/Default.Events");
const { User } = require("../../../../Global/Settings/Schemas")
class TagControl extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            enabled: true,
        });
    }

    async onLoad() {
        setInterval(() => { tagControl(); }, 600 * 1000);
        setInterval(() => { tagControl2(); }, 600 * 1000);
        setInterval(() => { tagControl3(); }, 600 * 1000);

        async function tagControl() {
            const guild = client.guilds.cache.get(system.Guild.ID)
            const aris = await ariscik.findOne({ guildID: guild.id })
            const members = guild.members.cache.filter(member => aris?.tags.some(x => member.user.tag.includes(x)) && !member.roles.cache.has(aris?.jailedRole) && !member.roles.cache.has(aris?.bannedTagRole) && !member.roles.cache.has(aris?.suspectRole) && !member.roles.cache.has(aris?.tagRole) && !member.user.bot).array().splice(0, 10)
            for await (const member of members) {
                await member.roles.add(aris?.tagRole)
                if (member.manageable) await member.setNickname(member.displayName.replace(aris?.unTag ? aris?.unTag : aris?.tags[0], aris?.tags[0]))
                guild.channels.cache.find(x => x.name == "tag-log").send({ content: `${member} (\`${member.id}\`) kişisinin isminde tagımız bulunduğu için otomatik olarak taglı rolü verilmiştir!` });
            }
        }

        async function tagControl2() {
            const guild = client.guilds.cache.get(system.Guild.ID)
            const aris = await ariscik.findOne({ guildID: guild.id })
            const members = guild.members.cache.filter(member => !aris?.tags.some(x => member.user.tag.includes(x)) && member.roles.cache.has(aris?.tagRole)).array().splice(0, 10)
            for await (const member of members) {
                await member.roles.remove(aris?.tagRole)
                if (member.manageable) await member.setNickname(member.displayName.replace(aris?.tags[0], aris?.unTag ? aris?.unTag : aris?.tags[0]))
                guild.channels.cache.find(x => x.name == "tag-log").send({ content: `${member} (\`${member.id}\`) kişisinin isminde tagımız bulunmadığı için otomatik olarak taglı rolü alınmıştır!` });
                const user = await User.findOne({ userID: member.id })
                if (user?.Tagged) {
                    let taglayanData = await User.findOne({ userID: user.TaggedAuth }) || {}
                    if (taglayanData) {
                        let taglibul = taglayanData.find(e => e.id == member.id)
                        if (taglibul) await User.updateOne({ userID: user.TaggedAuth }, { $pull: { "Taggeds": findUser } }, { upsert: true })
                        await Upstaff.updateOne({ guildID: guild.id, userID: user.TaggedAuth }, { $inc: { coin: -aris?.taggedCoin } }, { upsert: true });
                    }
                }
            }
        }

        async function tagControl3() {
            const guild = client.guilds.cache.get(system.Guild.ID)
            const aris = await ariscik.findOne({ guildID: guild.id })
            const members = guild.members.cache.filter(member => !aris?.tags.some(x => member.user.tag.includes(x)) && !member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !member.roles.cache.has(aris?.vipRole) && !member.roles.cache.has(aris?.boosterRole) && aris?.unregisterRoles.some(x => member.roles.cache.has(x))).array().splice(0, 10)
            for await (const member of members) {
                if (aris?.tagMode == true) {
                    await member.setRoles(aris?.unregisterRoles)
                    if (member.manageable) await member.setNickname(member.displayName.replace(aris?.tags[0], aris?.unTag ? aris?.unTag : aris?.tags[0]))
                    guild.channels.cache.find(x => x.name == "tag-log").send({ content: `${member} (\`${member.id}\`) kişisinin isminde tagımız bulunmadığı için otomatik olarak kayıtsıza atılmıştır! (Bu işlem sunucuda taglı sistem aktif olduğu için yapılmıştır.)` });
                    const user = await User.findOne({ userID: member.id })
                    if (user?.Tagged) {
                        let taglayanData = await User.findOne({ userID: user.TaggedAuth }) || {}
                        if (taglayanData) {
                            let taglibul = taglayanData.find(e => e.id == member.id)
                            if (taglibul) await User.updateOne({ userID: user.TaggedAuth }, { $pull: { "Taggeds": findUser } }, { upsert: true })
                            await Upstaff.updateOne({ guildID: guild.id, userID: user.TaggedAuth }, { $inc: { coin: -aris?.taggedCoin } }, { upsert: true });
                        }
                    }
                }
            }
        }
    }
}

module.exports = TagControl;

