const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	name: "summon",
	description: "Brings Bungus into your voice channel",
	execute: async (client, message, args) => {
		const voiceChannel = message.member.voice.channel
		if (!voiceChannel) return message.reply("Not in a channel")
    // Is the same as above
		// const channel = await client.channels.fetch(voiceChannel.id)

    const myGuild = message.member.voice.channel.guild
		const queue = await client.player.createQueue(myGuild)
		if (!queue.connection) await queue.connect(voiceChannel)


		// debugger
	},
}
