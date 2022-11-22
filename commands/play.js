const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { QueryType } = require("discord-player")
const wait = require("node:timers/promises").setTimeout

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
		console.log("PLAYING")
		const { client, guild } = interaction
		const searchTerm = interaction.options.getString("search")
		const voiceChannel = interaction.member.voice.channel
		if (!voiceChannel) return interaction.reply("Not in a channel")

		await interaction.deferReply()

		let queue
		const oldQueue = client.player.getQueue(guild)
		if (!!oldQueue) {
			console.log("oldQueue")
			queue = oldQueue
		} else {
			console.log("newQueue")
			queue = await client.player.createQueue(guild)
			await queue.setVolume(50)
		}
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
				// ? Why no work on playlist only??
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
		await interaction.editReply("🔻🔻🔻 Found some shit 🔻🔻🔻")
		await interaction.channel.send({ embeds: [embed] })
		// ? Delete it?
		// await wait(5000)
		// await interaction.deleteReply()
	},
}
