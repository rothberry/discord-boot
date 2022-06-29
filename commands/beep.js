module.exports = {
	name: "beep",
	description: "BEEP!",
	async execute(message) {
		return message.reply("Boop!")
		// return message.channel.send("Boop!")
	},
}
