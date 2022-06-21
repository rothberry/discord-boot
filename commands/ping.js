module.exports = {
    name: "ping",
    description: "this is a ping command",
    async execute(message, arg) {
        message.channel.send("PONG")
    }
	// async execute(interaction) {
	// 	return interaction.reply("Pong!")
	// },
}
