const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	name: "play",
	description: "play music",
	execute: async (client, message, args) => {
		const voiceChannel = message.member.voice.channel
		if (!voiceChannel) return message.reply("Not in a channel")

		const myGuild = message.member.voice.channel.guild
		const queue = await client.player.createQueue(myGuild)
		if (!queue.connection) await queue.connect(voiceChannel)

		let embed = new MessageEmbed()

		// ! Can handle single song search or url
		const result = await client.player.search(args.join(" "), {
			requestedBy: message.member.user,
			searchEngine: QueryType.AUTO,
		})
		if (!!result.playlist) {
			// if it's Playlist, then add all to queue
			const {
				tracks,
				playlist: { title, url, thumbnail },
			} = result
			await queue.addTracks(tracks)
			embed
				.setDescription(`**[${title}](${url})** has been added to the Queue`)
				.setThumbnail(thumbnail)
				.setFooter({ text: `Added ${tracks.length}` })
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
		await message.reply({
			embeds: [embed],
		})
	},
}
