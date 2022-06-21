const fs = require("node:fs")
const path = require("node:path")
const { Client, Collection, Intents } = require("discord.js")
// const Discord = require("discord.js")
const { token } = require("./config.json")

const prefix = "!"

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

client.once("ready", () => {
	console.log("Ready for " + client.user.username + "!")
})

client.on("messageCreate", (message) => {
	console.log("messageCreate")
	if (!message.content.startsWith(prefix) || message.author.bot) return

	const args = message.content.slice(prefix.length).split(/ +/)
	// const command = args.shift().toLowerCase()

	console.log(`the message is: ${message}`)
	console.log({ args })

	args.forEach((arg) => {
		switch (arg.toLowerCase()) {
			case "ping":
				message.channel.send("PONG")
				break
			case "pong":
				message.channel.send("PING")
			default:
				break
		}
	})
})

client.login(token)
