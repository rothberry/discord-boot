const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setRequired(false)
				.setDescription("Number of Tracks to skip")
		)
		.setDescription("Skip current track"),
	execute: async (interaction) => {
		const { client, guild } = interaction
		let amount = interaction.options.getInteger("amount") || 1
		const queue = client.player.getQueue(guild)
		if (!queue) return await message.reply("Nothing in the Queue!")

		const skippedTrack = queue.current
		const nextUp = queue.tracks[amount - 1]

		// ? Can't seem to loop forwards to hold onto all the previous tracks
		// for (let i = 0; i < amount; i++) {
		// 	await queue.jump(1)
		// }
		// * These seeeeeem to be acting the same...
		await queue.skipTo(amount - 1)
		// await queue.jump(amount - 1)

		// ? Why it work on the back tho?
		// const nextUp = await queue.nowPlaying()

		console.log({ skippedTrack, nextUp, queue })

		let embed = new EmbedBuilder()
			.setTitle(`Now Playing: ${nextUp.title}`)
			.setThumbnail(nextUp.thumbnail)
			.setDescription(`Skipped: ${skippedTrack.title}`)

		await interaction.channel.send({ embeds: [embed] })
	},
}
