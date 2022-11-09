const { REST, Routes } = require("discord.js")
const { clientId, guildId, token } = require("./config.json")
const fs = require("fs")

const commands = []
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"))

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	commands.push(command.data.toJSON())
}

console.log({ commands })
// const testBeep = require(`./commands/beep.js`)
// commands.push(testBeep.data.toJSON())

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token)

// and deploy your commands!
const deploy = async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		)

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			// * For personal server registration
			// Routes.applicationGuildCommands(clientId, guildId),
			// * for GLOBAL registration
			Routes.applicationCommands(clientId),
			{ body: commands }
		)

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		)
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error)
	}
}

deploy()
