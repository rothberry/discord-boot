const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setRequired(false)
				.setDescription("Show this many songs in the queue")
				.setMaxValue(50)
				.setMinValue(0)
		)
		.setDescription("Shows the queue of songs (is not perfect yet..)"),

	execute: async (interaction) => {
		const { client, guild } = interaction
		const queue = client.player.queues.get(guild)
		if (!queue) return await interaction.reply("Nothing in the queue!")

		await interaction.deferReply()

		let mappedTracks = queue.tracks.map(
			(t, i) => `${i + 1}:\t ${t.author ? t.author + " - " : null}${t.title}`
		)
		let amount = interaction.options.getInteger("amount") || 50

		const np = queue.currentTrack
		if (queue.tracks.size > 0) {
			let embed = new EmbedBuilder()
				.setTitle(`${np.author ? np.author + " - " : null}${np.title} `)
				.setURL(np.url)
				.setThumbnail(np.thumbnail)
				.setDescription(mappedTracks.slice(0, amount).join("\n"))
				.setFooter({ text: `${mappedTracks.length} tracks left` })

			await interaction.channel.send({ embeds: [embed] })
			await interaction.deleteReply()
		} else {
			await interaction.editReply(
				"Oi bruv, there ain't nuttin' left in da queue.."
			)
		}
	},
}
