const { SlashCommandBuilder, MessageEmbed, ChannelType } = require("discord.js")
// const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("summon")
		.setDescription("Brings Bungus into your voice channel"),
	async execute(interaction) {
		const { client, guild } = interaction
		// debugger
		const vChannel = interaction.member.voice.channel
		if (!vChannel) return interaction.reply("Not in a channel")

		const queue = await client.player.createQueue(guild)
		if (!queue.connection) await queue.connect(vChannel)
	},
}
