const fs = require("fs")
const path = require("path")
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js")
const { Player } = require("discord-player")
const { token } = require("./config.json")
const {
	YouTubeExtractor,
	SpotifyExtractor,
	SoundCloudExtractor,
} = require("@discord-player/extractor")
const { starLine, starWrap, starMid } = require("./debugHelpers")

const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
	],
})

client.commands = new Collection()

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command)
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
		)
	}
}

client.once("ready", () => {
	console.clear()
	starMid("Ready for " + client.user.username + "!")
})

client.player = new Player(client, {
	ytdlOptions: {
		quality: "highestaudio",
		highWaterMark: 1 << 25,
	},
	connectionTimeout: 1000,
})

const loadExtractors = async (player) => {
	await player.extractors.loadDefault()

	await player.extractors.register(YouTubeExtractor, {})
	await player.extractors.register(SpotifyExtractor, {})
	await player.extractors.register(SoundCloudExtractor, {})
	// starMid("Loaded Extractors")
}

// ? Found to stop the music from stopping around 55 seconds in, is apparently an issue with the new @discordjs/voice not the discord-player...
client.player.events.on("connection", (queue) => {
	queue.dispatcher.voiceConnection.on("stateChange", (oldState, newState) => {
		starMid(`Hit VC State Change`)
		const oldNetworking = Reflect.get(oldState, "networking")
		const newNetworking = Reflect.get(newState, "networking")

		const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
			const newUdp = Reflect.get(newNetworkState, "udp")
			clearInterval(newUdp?.keepAliveInterval)
		}

		oldNetworking?.off("stateChange", networkStateChangeHandler)
		newNetworking?.on("stateChange", networkStateChangeHandler)
	})
})

loadExtractors(client.player)

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	const command = interaction.client.commands.get(interaction.commandName)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		starWrap({ commandName: interaction.commandName })
		await command.execute(interaction)
	} catch (error) {
		starLine("E")
		console.error(`Error executing ${interaction.commandName}`)
		console.error(error)
	}
})

client.login(token)

client.on("error", (err) => {
	console.error({ err })
})
