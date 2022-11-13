const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("summon")
		.setDescription("Brings Bungus into your voice channel"),
	async execute(interaction) {
		const { client, guild } = interaction
		const vChannel = interaction.member.voice.channel
		if (!vChannel) return interaction.reply("Not in a channel")

		const queue = await client.player.createQueue(guild)
		if (!queue.connection) await queue.connect(vChannel)
		await interaction.reply("I HAVE ARRIVED")
	},
}
