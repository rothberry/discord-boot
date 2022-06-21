module.exports = {
	name: "shroom",
	description: "send a shroom",
	async execute(message, arg) {
		const img_url =
			"https://tenor.com/view/soomin-mushroom-wriggle-wiggle-soominshroom-gif-20187102"
		return message.channel.send(img_url)
	},
}
