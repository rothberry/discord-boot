const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Resumes Music"),
	execute: async (interaction) => {
		const { guild, client } = interaction
		const queue = client.player.getQueue(guild)
		if (!queue) return await interaction.reply("The queue is empty..")

		queue.setPaused(false)
		await interaction.reply("Resuming...")
	},
}
