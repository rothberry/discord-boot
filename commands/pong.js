const { SlashCommandBuilder } = require("discord.js")
const wait = require("node:timers/promises").setTimeout

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pong")
		.addIntegerOption((option) =>
			option
				.setName("time")
				.setDescription("Time in milliseconds til next ping!")
				.setRequired(false)
		)
		.setDescription("Sends a Ping, and a ping again!"),
	async execute(interaction) {
		await interaction.reply("PING!")
		await wait(interaction.options.getInteger("time") || 2000)
		await interaction.editReply("PING AGAIN!")
	},
}
