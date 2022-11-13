const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Gives help for how to use the bot"),
	async execute(interaction) {
    await interaction.reply("HELP")
	},
}
