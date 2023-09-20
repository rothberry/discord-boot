const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("seek")
		.addIntegerOption((option) =>
			option
				.setName("seconds")
				.setRequired(false)
				.setDescription("Seconds to seek")
		)
		.setDescription(
			"Seeks ahead 30 seconds, optional parameter of other amounts"
		),
	execute: async (interaction) => {
		const { client, guild } = interaction
		let seconds = interaction.options.getInteger("seconds") || 30
		const queue = client.player.queues.get(guild)
		if (!queue) return await interaction.reply("Nothing in the queue!")
		const ts = queue.node.getTimestamp()
		const { current, total } = ts

		const newTime = current.value + seconds * 1000
		if (newTime <= total.value) {
			await queue.node.seek(newTime)
			await interaction.reply(`Sooked ahead ${seconds} seconds`)
		} else {
			await interaction.reply(`There are not that many seconds here bruh`)
		}
	},
}
