// const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	// data: new SlashCommandBuilder()
	// 	.setName('beep')
	// 	.setDescription('Beep!'),
	// async execute(interaction) {
	//     return interaction.reply("Boop!")
	// },

	name: "beep",
	description: "BEEP!",
	async execute(message) {
		return message.reply("Boop!")
		// return message.channel.send("Boop!")
	},
}
