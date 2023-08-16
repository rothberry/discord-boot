const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("seek")
		.addIntegerOption((option) =>
			option
				.setName("seconds")
				.setRequired(false)
				.setDescription("Seconds to seek")
		)
		.setDescription(
			"Seeks ahead 30 seconds, optional parameter of other amounts"
		),
	execute: async (interaction) => {
		const { client, guild } = interaction
		let seconds = interaction.options.getInteger("seconds") || 30
		const queue = client.player.queues.get(guild)
		if (!queue) return await interaction.reply("Nothing in the queue!")
		console.log("SEEKING")
		console.log({ seconds })

		const ts = queue.getPlayerTimestamp()
		const { current, end } = ts
		const currentMS = convert(current)
		const endMS = convert(end)

		let newTime = currentMS + seconds * 1000
		console.log({ ts, currentMS, endMS, newTime })
		await queue.seek(newTime)

		await interaction.reply(`Sooked ahead ${seconds} seconds`)
	},
}

const convert = (minuteStr) => {
	const splitNumber = minuteStr.split(":")
	return Number(splitNumber[0]) * 60 * 1000 + Number(splitNumber[1]) * 1000
}
