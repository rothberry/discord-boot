const fs = require("node:fs")
const path = require("node:path")
const { Client, Collection, Intents } = require("discord.js")
// const Discord = require("discord.js")
const { token } = require("./config.json")

const prefix = "!"

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
// const client = new Discord.Client()

client.once("ready", () => {
	console.log("Ready for " + client.user.username + "!")
})

client.on("messageCreate", (message) => {
	console.log("fuuuu")
	if (!message.content.startsWith(prefix) || message.author.bot) {
		console.log("no data")
		return
	}

	const args = message.content.slice(prefix.length).split(/ +/)
	const command = args.shift().toLowerCase()

	console.log(`the message is: ${message}`)
	console.log({ args, command })

	if (command === "ping") {
		message.channel.send("PONG")
	}
})

client.on("interactionCreate", (interaction) => {
	console.log("fuuuu")
	console.log({ interaction })
})

client.login(token)

console.log("done")
