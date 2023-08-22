const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pauses and Resumes Music"),
	execute: async (interaction) => {
		const { guild, client } = interaction
		const queue = client.player.queues.get(guild)
		if (!queue) return await interaction.reply("The queue is empty..")

		if (queue.node.isPaused()) {
			await interaction.reply("Resuming...")
			queue.node.resume()
		} else {
			await interaction.reply("Paused...")
			queue.node.pause()
		}
	},
}
