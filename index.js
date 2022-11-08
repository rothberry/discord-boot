const fs = require("fs")
const path = require("path")
const {
	Client,
	Collection,
	GatewayIntentBits,
	GuildMember,
	Events,
	REST,
	Routes,
} = require("discord.js")
const { Player } = require("discord-player")

const { token } = require("./config.json")

const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
	],
})

const prefix = "!"

// ! in deploy commands?
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

const member = new GuildMember(client)
// TODO Refactor out client. to just player
client.player = new Player(client, {
	ytdlOptions: {
		quality: "highestaudio",
		highWaterMark: 1 << 25,
	},
})

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
		await command.execute(interaction)
	} catch (error) {
		console.error(`Error executing ${interaction.commandName}`)
		console.error(error)
	}
})

client.login(token)

// client.on("apiResponse", (res) => {
// 	console.log({ res })
// })

client.on("error", (err) => {
	console.error({ err })
})
