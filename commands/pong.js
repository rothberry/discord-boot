module.exports = {
	name: "pong",
	description: "this is a pong command",
	async execute(message) {
		return message.reply("PING>>>")
	},
}
