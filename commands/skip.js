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
		await interaction.reply("https://images2.minutemediacdn.com/image/upload/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/shape/cover/sport/construction-banner-5bfe1ad8296f53a90e679a494b794301.jpg")
	},
	execute2: async (interaction) => {
		const { client, guild } = interaction
		let amount = interaction.options.getInteger("amount") || 1
		const queue = client.player.queues.get(guild)
		if (!queue) return await message.reply("Nothing in the Queue!")

		await interaction.deferReply()

		const skippedTrack = queue.currentTrack
		const nextUp = queue.tracks[amount - 1]

		// ? Can't seem to loop forwards to hold onto all the previous tracks
		// for (let i = 0; i < amount; i++) {
		// 	await queue.jump(1)
		// }
		// * These seeeeeem to be acting the same...
		await queue.node.skipTo(amount - 1)
		// await queue.jump(amount - 1)

		// ? Why it work on the back tho?
		// const nextUp = await queue.nowPlaying()

		console.log({ skippedTrack, nextUp, queue })

		let embed = new EmbedBuilder()
			.setTitle(`Now Playing: ${nextUp.title}`)
			.setThumbnail(nextUp.thumbnail)
			.setDescription(`Skipped: ${skippedTrack.title}`)

		await interaction.channel.send({ embeds: [embed] })
		await interaction.deleteReply()
	},
}
