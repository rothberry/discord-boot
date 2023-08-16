const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("back")
		.setDescription("Go back to the last track played."),
	// TODO Add amount to go back
	// .addIntegerOption((option) =>
	// 	option
	// 		.setName("amount")
	// 		.setRequired(false)
	// 		.setDescription("Number of Played Tracks to go backwards")
	// ),
	execute: async (interaction) => {
		const { client, guild } = interaction
		const queue = client.player.queues.get(guild)
		if (!queue) return await message.reply("Nothing in the Queue!")

		await interaction.deferReply()

		// let amount = interaction.options.getInteger("amount") || 1
		// for (let i = 0; i < amount; i++) {
		// }

		const skippedTrack = queue.current
		// // const backUp = queue.previousTracks[amount - 1] || queue.previousTracks[0]
		await queue.back()

		const backUp = await queue.nowPlaying()

		console.log({ backUp, skippedTrack, queue })

		let embed = new EmbedBuilder()
			.setTitle(`Now Playing: ${backUp.title}`)
			.setThumbnail(backUp.thumbnail)
			.setDescription(`Backed: ${skippedTrack.title}`)

		await interaction.channel.send({ embeds: [embed] })
		await interaction.deleteReply()
	},
}
