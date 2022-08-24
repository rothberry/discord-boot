const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	name: "disconnect",
	description: "Disconnects Bungus from the Channel",
	execute: async (client, message, args) => {
		const queue = client.player.getQueue(message.member.voice.channel.guild.id)

		// client.player._handleVoiceState()
		debugger
		await message.reply("Dueces.. :call_me:")
	},
}
