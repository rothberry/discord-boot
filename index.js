const fs = require("fs")
// const path = require("path")
const { Client, Collection, Intents, GuildMember } = require("discord.js")
const { Player } = require("discord-player")

require("dotenv").config()
const { token } = process.env

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
	if (command.data) {
		client.commands.set(command.data.name, command)
	} else {
		client.commands.set(command.name, command)
	}
}

client.once("ready", () => {
	console.log("Ready for " + client.user.username + "!")
})

const member = new GuildMember(client)
client.player = new Player(client, {
	ytdlOptions: {
		quality: "highestaudio",
		highWaterMark: 1 << 25,
	},
})

// ! using module.exports
client.on("messageCreate", (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return
	console.log("messageCreate Dynamic")

	const args = message.content.slice(prefix.length).split(/ +/)

	// console.log(`the message is: ${message} in ${message.channel.name}`)
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
			}
			break
		case "stop":
			client.commands.get("stop").execute(client, message)
			break
		case "help":
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
