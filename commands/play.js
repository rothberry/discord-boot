const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { starMid } = require("../debugHelpers.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.addStringOption((option) =>
			option.setName("search").setRequired(true).setDescription("searchTerms")
		)
		.setDescription(
			"Can search youtube for first result, or can take a URL, may work for Spotfiy too?"
		),

	execute: async (interaction) => {
		starMid("PLAYING")
		const {
			client: { player },
			guild,
		} = interaction
		const searchTerm = interaction.options.getString("search")

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
					// ? Why no work on playlist only??
					// .setThumbnail(thumbnail)
					.setFooter({ text: `Added ${tracks.length} tracks` })
			} else {
				// console.log(track)
				const { title, url, thumbnail, duration } = track
				await queue.addTrack(track)
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
