const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("shroom")
		.setDescription("How dare you.."),
	execute: async (interaction) => {
		await interaction.reply(
			"https://tenor.com/view/soomin-mushroom-wriggle-wiggle-soominshroom-gif-20187102"
		)
	},
}
