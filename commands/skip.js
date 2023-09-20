const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip current track")
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setRequired(false)
				.setDescription("Number of Tracks to skip")
		),
	execute: async (interaction) => {
		const { client, guild } = interaction
		let amount = interaction.options.getInteger("amount") || 1
		const queue = client.player.queues.get(guild)
		if (!queue) return await message.reply("Nothing in the Queue!")

		await interaction.deferReply()

		const skippedTrack = queue.currentTrack
		const nextUp = queue.tracks.store[amount - 1]
		await queue.node.skipTo(nextUp)

		let embed = new EmbedBuilder()
			.setTitle(`Now Playing: ${nextUp.title}`)
			.setThumbnail(nextUp.thumbnail)
			.setDescription(`Skipped: ${skippedTrack.title}`)

		await interaction.channel.send({ embeds: [embed] })
		await interaction.deleteReply()
	},
}
