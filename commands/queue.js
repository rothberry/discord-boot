const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setRequired(false)
				.setDescription("Show this many songs in the queue")
		)
		.setDescription("Shows the queue of songs"),

	execute: async (interaction) => {
		const { client, guild } = interaction
		let amount = interaction.options.getInteger("amount")
		const queue = client.player.getQueue(guild)
		if (!queue) return await interaction.reply("Nothing in the queue!")

		let mappedTracks = queue.tracks.map((t, i) => `${i + 1}:\t ${t.title}`)

		// todo maybe not show all queue, just x amount of tracks
		const np = queue.nowPlaying()

		// TODO there's gotta be a better way
		if (!amount || amount > mappedTracks.length) {
			amount = mappedTracks.length
		}

		// TODO error if nothing left in queue
		let embed = new EmbedBuilder()
			.setTitle(np.title)
			.setURL(np.url)
			.setThumbnail(np.thumbnail)
			.setDescription(mappedTracks.slice(0, amount).join("\n"))
			.setFooter({ text: `${mappedTracks.length} tracks left` })

		await interaction.channel.send({ embeds: [embed] })
	},
}
