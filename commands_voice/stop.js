module.exports = {
	name: "stop",
	description: "Stop Bungus",
	execute: async (client, message) => {
		console.log("Stopping Bungus")
		// todo find connection
		const queue = client.player.getQueue(message.member.voice.channel.guild.id)
		if (!queue) return await message.reply("THERE ARE NO ONGS!")

		queue.destroy()
		await message.reply("Dueces.. :call_me:")
	},
}
