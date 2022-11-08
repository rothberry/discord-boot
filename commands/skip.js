const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		// .addIntegerOption((option) =>
		// 	option
		// 		.setName("numTracks")
		// 		.setRequired(false)
		// 		.setDescription("Number of Tracks to skip")
		// )
		.setDescription("Skip current track"),
	execute: async (interaction) => {
		const { client, guild } = interaction
		// let amount = interaction.options.getInteger("amount")
		const queue = client.player.getQueue(guild)
		if (!queue) return await message.reply("Nothing in the Queue!")

		const skippedTrack = queue.current
		await queue.skip()
		const skippedTo = await queue.current

		// TODO add amount to skip
		// await queue.skipTo(amount - 1)
		// const skippedTo = await queue.tracks[0]

		// debugger
		let embed = new EmbedBuilder()
			.setTitle(`Now Playing: ${skippedTo.title}`)
			.setThumbnail(skippedTo.thumbnail)
			.setDescription(`Skipped: ${skippedTrack.title}`)

		await interaction.channel.send({ embeds: [embed] })
	},
}
