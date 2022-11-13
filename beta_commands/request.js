const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("request")
		.setDescription("Anyone can request additions to Bungus. (Within reason)"),
	async execute(interaction) {
		// TODO
		// takes in an arg and writes to a .txt file?
		// takes in an arg and sends an email or discord message?
		await interaction.reply("REQUEST THESE NUTS")
	},
}
