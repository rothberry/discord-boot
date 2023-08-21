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
	console.log("Ready for " + client.user.username + "!")
})

client.player = new Player(client, {
	ytdlOptions: {
		quality: "highestaudio",
		highWaterMark: 1 << 25,
	},
	smoothVolume: true,
})

const loadExtractors = async (player) => {
	await player.extractors.loadDefault()

	await player.extractors.register(YouTubeExtractor, {})
	await player.extractors.register(SpotifyExtractor, {})
	await player.extractors.register(SoundCloudExtractor, {})
	console.log({ pExtractors: player.extractors })
}

loadExtractors(client.player)

client.player.addListener("connectionCreate", () => {
	console.log("CREATING CONNECTION")
})

client.player.addListener("botDisconnect", (e) => {
	console.log("\nDISCONNNECTINGGGGG\n")
})

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	const command = interaction.client.commands.get(interaction.commandName)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		console.log({ commandName: interaction.commandName })
		await command.execute(interaction)
	} catch (error) {
		console.error(`Error executing ${interaction.commandName}`)
		console.error(error)
	}
})

client.login(token)

client.on("error", (err) => {
	console.error({ err })
})
