module.exports = {
	name: "volume",
	description: "Sets the volume to a certian limit",
	execute: async (client, message, limit) => {
		const queue = client.player.getQueue(message.member.voice.channel.guild.id)
		if (!queue) return await message.reply("THERE ARE NO ONGS!")

		if (limit > 100) limit = 100
		else if (limit < 0) limit = 1

		queue.setVolume(limit)
		await message.reply("Set Volume to: " + limit)
	},
}
