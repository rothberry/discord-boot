const fs = require("fs")
// const path = require("path")
const { Client, Collection, Intents, GuildMember } = require("discord.js")
const {
	joinVoiceChannel,
	getVoiceConnection,
	createAudioPlayer,
	createAudioResource,
} = require("@discordjs/voice")

require("dotenv").config()
const { token } = process.env

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
})

const member = new GuildMember(client)

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
			// Summon bot into current voice channel
			// play music

			const connection = joinVoiceChannel({
				channelId: message.member.voice.channel.id,
				guildId: message.guild.id,
				adapterCreator: message.guild.voiceAdapterCreator,
			})
			const audioPlayer = createAudioPlayer()
			const resource = createAudioResource("./assets/I_Wan'na_Be_Like_You.mp3")
			audioPlayer.play(resource)
			connection.subscribe(audioPlayer)

			break
		case "stop":
			// const connection = getVoiceConnection(myVoiceChannel.guild.id)
			// connection.destroy()
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
