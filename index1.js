const { Client, GatewayIntentBits } = require("discord.js")
const {
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	NoSubscriberBehavior,
} = require("@discordjs/voice")

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
})

const token = "YOUR_BOT_TOKEN"
const channelId = "YOUR_CHANNEL_ID"

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}`)
})

client.on("messageCreate", async (message) => {
	if (message.content === "!join") {
		if (message.member?.voice.channel) {
			const connection = joinVoiceChannel({
				channelId: message.member.voice.channel.id,
				guildId: message.guild.id,
				adapterCreator: message.guild.voiceAdapterCreator,
			})

			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause,
				},
			})

			const resource = createAudioResource("path/to/audio/file.mp3")
			player.play(resource)

			connection.subscribe(player)
		} else {
			message.reply("You need to be in a voice channel to use this command.")
		}
	}
})

client.login(token)
