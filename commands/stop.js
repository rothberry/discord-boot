const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("stop").setDescription("Stopping Bungus"),
	async execute(interaction) {
		const { client, guild } = interaction
		const queue = await client.player.queues.get(guild)
		if (!queue) return await interaction.reply("He ain't here")
		queue.destroy()
		await interaction.reply("Dueces.. :call_me:")
	},
}
