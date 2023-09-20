const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { starMid } = require("../debugHelpers.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.addStringOption((option) =>
			option.setName("search").setRequired(true).setDescription("searchTerms")
		)
		.addBooleanOption((option) =>
			option.setName("top").setRequired(false).setDescription("Add to top")
		)
		.setDescription(
			"Search yt or track/playlist URL from most music libraries (Spotify/Soundcloud/Youtube)"
		),

	execute: async (interaction) => {
		starMid("PLAYING")
		const {
			client: { player },
			guild,
		} = interaction
		const searchTerm = interaction.options.getString("search")
		const isFirst = interaction.options.getBoolean("top")

		// TODO refactor all of these voice checks for all the VC commands
		const voiceChannel = interaction.member.voice.channel
		if (!voiceChannel) return interaction.reply("Not in a channel")

		await interaction.deferReply()
		// * queues.create => finds or creates queue
		let queue = player.queues.create(guild, { volume: 10 })

		if (!queue.connection) await queue.connect(voiceChannel)

		const result = await player.search(searchTerm, {
			requestedBy: interaction.user,
		})

		starMid(` Searching for: ${searchTerm}`)
		starMid(`extractor: ${result.extractor.identifier}`)

		let embed = new EmbedBuilder()

		const track = result.tracks[0]
		if (result.hasTracks()) {
			// TODO yt playlist stopped working?
			if (!!result.playlist) {
				// if it's Playlist, then add all to queue
				const {
					tracks,
					playlist: { title, url, thumbnail },
				} = result
				await queue.addTrack(result.playlist)
				embed
					.setDescription(
						`**[${title}](${url})** playlist has been added to the Queue`
					)
					// ? Why no work on playlist only??
					// .setThumbnail(thumbnail)
					.setFooter({ text: `Added ${tracks.length} tracks` })
			} else {
				// console.log(track)
				const { title, url, thumbnail, duration } = track
				isFirst
					? await queue.insertTrack(track, 0)
					: await queue.addTrack(track)
				embed
					.setDescription(`**[${title}](${url})** has been added to the Queue`)
					.setThumbnail(thumbnail)
					.setFooter({ text: `Duration: ${duration}` })
			}
			if (!queue.node.isPlaying()) await queue.node.play()
			await interaction.editReply("🔻🔻🔻 Found some shit 🔻🔻🔻")
			await interaction.channel.send({ embeds: [embed] })
		} else {
			await interaction.editReply("🔺🔺🔺 We ain't found shit 🔺🔺🔺")
		}
	},
}
