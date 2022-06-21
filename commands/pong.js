module.exports = {
	name: "pong",
	description: "this is a pong command",
	// async execute(message, arg) {
	//     message.channel.send("PING")
	// }
	async execute(message) {
		return message.reply("PING>>>")
	},
}
