const fs = require("fs")
// const path = require("path")
const {
	Client,
	Collection,
	Intents,
	GuildMember,
	MessageEmbed,
} = require("discord.js")
const { Player } = require("discord-player")

require("dotenv").config()
const { token, PORT } = process.env

const port = PORT || 8080

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
})

const prefix = "!"

// ! in deploy commands?
client.commands = new Collection()

const commandFiles = fs
	.readdirSync("./commands/")
	.filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
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
	connectionTimeout: 5000
})

// client.player.addListener("connectionCreate", () => {
// 	console.log("CREATING CONNECTION")
// })

client.player.addListener("botDisconnect", (e) => {
	console.log("\nDISCONNNECTINGGGGG\n")
})

// ! using module.exports
client.on("messageCreate", (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return

	const args = message.content.slice(prefix.length).split(/ +/)
	console.log({ args })

	switch (args[0].toLowerCase()) {
		case "ping":
			client.commands.get("ping").execute(message, arg)
			break
		case "pong":
			client.commands.get("pong").execute(message, arg)
			break
		case "beep":
			client.commands.get("beep").execute(message, arg)
			break
		case "shroom":
			client.commands.get("shroom").execute(message, arg)
			break
		case "play":
			if (args.length > 1) {
				client.commands.get("play").execute(client, message, args.slice(1))
			} else {
				message.reply("!play needs a search query or url...")
			}
			break
		case "stop":
			client.commands.get("stop").execute(client, message)
			break
		case "pause":
			client.commands.get("pause").execute(client, message)
			break
		case "resume":
			client.commands.get("resume").execute(client, message)
			break
		case "seek":
			// takes an (Optional) arg of seconds to skip
			if (typeof parseInt(args[1]) === "number") {
				client.commands.get("seek").execute(client, message, parseInt(args[1]))
			}
			break
		case "info":
			// TODO Send queue instead of client or player?
			client.commands.get("info").execute(client, message)
			break
		case "skip":
			client.commands
				.get("skip")
				.execute(client, message, parseInt(args[1]) || 1)
			break
		case "queue":
			client.commands
				.get("queue")
				.execute(client, message, parseInt(args[1]) || null)
			break
		case "volume":
			// takes in an arg to set the volume level
			if (typeof parseInt(args[1]) === "number") {
				client.commands
					.get("volume")
					.execute(client, message, parseInt(args[1]))
			}
			break
		case "summon":
			client.commands.get("summon").execute(client, message)
			break
		case "disconnect":
			client.commands.get("disconnect").execute(client, message)
			break
		case "help":
			// TODO Add prettier help
			let helpList = [
				"List of Current Commands:\n",
				"!help\t=>\tShows this list\n",
			]
			for (const cmd of client.commands) {
				console.log({ cmd })
				helpList.push(`!${cmd[0]}\t=>\t${cmd[1].description}\n`)
			}
			message.channel.send(helpList.join(" "))
			break
		default:
			break
	}
})

client.login(token)

// client.on("apiResponse", (res) => {
// 	console.log({ res })
// })

client.on("error", (err) => {
	console.error({ err })
})
