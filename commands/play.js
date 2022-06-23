const ytdl = require("ytdl-core")
const ytSearch = require("yt-search")

module.exports = {
	name: "play",
	description: "play music",
	async execute(message, args) {
		const {
			joinVoiceChannel,
			createAudioPlayer,
			createAudioResource,
		} = require("@discordjs/voice")
		const { OpusEncoder } = require('@discordjs/opus');
		const encoder = new OpusEncoder(48000, 2);

		// TODO current users voice channel does not change
		// seems to stay #General

		const voiceChannel = message.member.voice.channel
		// debugger

		if (!voiceChannel) return message.reply("Not in a channel")
		const permissions = voiceChannel.permissionsFor(message.client.user)
		if (!permissions.has("CONNECT")) return message.reply("Can't connect")
		if (!permissions.has("SPEAK")) return message.reply("Can't speak..")

		// console.log(message.member.user.username, voiceChannel.name)
		console.log("Summoning into: ", voiceChannel.name)
		const connection = await joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		})

		const videoFinder = async (query) => {
			console.log("finder starting...")
			const videoResult = await ytSearch(query)
			console.log({ query, videoResult })
			return videoResult.videos[0]
		}
		const video = await videoFinder(args.slice(1).join(" "))

		if (!!video) {
			const stream = ytdl(video.url, { filter: "audioonly" })
			// connection.play(stream, { seek: 0, volume: 1 })
			const player = createAudioPlayer()
			const resource = createAudioResource(video.url)
			connection.subscribe(player)
			player.play(resource)
			// console.log(video)
			message.reply("Playing: " + video.title)
			debugger

			connection.on("finish", () => {
				connection.destroy()
			})
		}
		// debugger
	},
}
