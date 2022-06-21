const fs = require("fs")
// const path = require("path")
const { Client, Collection, Intents } = require("discord.js")
const { token } = require("./config.json")

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
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
	console.log(client.commands)
})

// ! using module.exports
client.on("messageCreate", (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return
	console.log("messageCreate Dynamic")

	const args = message.content.slice(prefix.length).split(/ +/)

	// console.log(`the message is: ${message} in ${message.channel.name}`)
	console.log({ args })

	args.forEach(async (arg) => {
		switch (arg.toLowerCase()) {
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
			default:
				break
		}
	})
})

client.login(token)
