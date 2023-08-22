const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("volume")
		.addIntegerOption((option) =>
			option
				.setName("volume")
				.setRequired(true)
				.setDescription("Set volume percentage")
				.setMinValue(0)
				.setMaxValue(100)
		)
		.setDescription("Set volume level (0-100)"),
	execute: async (interaction) => {
		const { client, guild } = interaction
		const volume = interaction.options.getInteger("volume")
		const queue = client.player.queues.get(guild)
		if (!queue) return await interaction.reply("Nothing in the queue")

		queue.node.setVolume(volume)
		await interaction.reply("Set Volume to: " + volume)
	},
}
