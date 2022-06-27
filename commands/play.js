const ytdl = require("ytdl-core")
const ytSearch = require("yt-search")
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	StreamType,
} = require("@discordjs/voice")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

// const { OpusEncoder } = require("@discordjs/opus")
// const encoder = new OpusEncoder(48000, 2)

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
		// const testUrl = "https://www.youtube.com/watch?v=Iczqotmm5sk"
		if (args[0] === "url") {
			const result = await client.player.search(args[1], {
				requestedBy: message.member.user,
				searchEngine: QueryType.YOUTUBE_VIDEO,
			})
			const song = result.tracks[0]
			console.log({ result, message })
			await queue.addTrack(song)
			embed
				.setDescription(
					`**[${song.title}](${song.url})** has been added to the Queue`
				)
				.setThumbnail(song.thumbnail)
				.setFooter({ text: `Duration: ${song.duration}` })
		}
		if (!queue.playing) await queue.play()
		await message.reply({
			embeds: [embed],
		})
	},
	perform: async (client, message) => {
		const voiceChannel = message.member.voice.channel
		if (!voiceChannel) return message.reply("Not in a channel")

		const permissions = voiceChannel.permissionsFor(message.client.user)
		if (!permissions.has("CONNECT")) return message.reply("Can't connect")
		if (!permissions.has("SPEAK")) return message.reply("Can't speak..")

		console.log("Summoning into: ", voiceChannel.name)
		const connection = await joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		})
		// debugger

		const videoFinder = async (query) => {
			console.log("finder starting...")
			const videoResult = await ytSearch(query)
			console.log({ query, videoResult })
			return videoResult.videos[0]
		}
		const video = await videoFinder("flume say nothing")

		const stream = ytdl(video.url, { filter: "audioonly" })
		// connection.play(stream, { seek: 0, volume: 1 })
		const player = createAudioPlayer()
		// const resource = createAudioResource(video.url)
		connection.subscribe(player)
		let resource = createAudioResource(stream, {
			inputType: StreamType.OggOpus,
		})
		resource.encoder = encoder

		console.log("encoder: ", resource.encoder)
		debugger
		if (player.checkPlayable()) {
			player.play(resource)
			message.reply("Playing: " + "flume say nothing")
		} else {
			console.log("Couldn't play...")
		}
	},
}
