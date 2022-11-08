const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("pong").setDescription("Sends a Ping!"),
	async execute(interaction) {
		await interaction.reply("PING!")
	},

}
