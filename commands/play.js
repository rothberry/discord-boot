const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.addStringOption((option) =>
			option.setName("search").setRequired(true).setDescription("searchTerms")
		)
		.setDescription("Can search youtube for first result, or can take a URL"),

	execute: async (interaction) => {
		console.log("PLAYING")
		const { client, guild } = interaction
		const searchTerm = interaction.options.getString("search")
		const voiceChannel = interaction.member.voice.channel
		if (!voiceChannel) return interaction.reply("Not in a channel")
		const queue = await client.player.createQueue(guild)
		if (!queue.connection) await queue.connect(voiceChannel)

		const result = await client.player.search(searchTerm, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO,
		})

		console.log({ searchTerm, result })
		let embed = new EmbedBuilder()

		if (!!result.playlist) {
			// if it's Playlist, then add all to queue
			const {
				tracks,
				playlist: { title, url, thumbnail },
			} = result
			await queue.addTracks(tracks)
			embed
				.setDescription(
					`**[${title}](${url})** playlist has been added to the Queue`
				)
				// TODO Why no work on playlist only??
				// .setThumbnail(thumbnail)
				.setFooter({ text: `Added ${tracks.length} tracks` })
		} else {
			const track = result.tracks[0]
			const { title, url, thumbnail, duration } = track
			await queue.addTrack(track)
			embed
				.setDescription(`**[${title}](${url})** has been added to the Queue`)
				.setThumbnail(thumbnail)
				.setFooter({ text: `Duration: ${duration}` })
		}

		if (!queue.playing) await queue.play()
		interaction.channel.send({ embeds: [embed] })
	},
}
