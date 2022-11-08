module.exports = {
	name: "pause",
	description: "Pauses Music",
	execute: async (client, message) => {
		const myGuild = message.member.voice.channel.guild
		const queue = client.player.getQueue(myGuild)
		if (!queue) return await message.reply("THERE ARE NO ONGS!")

		queue.setPaused(true)
		message.reply("Paused...")
	},
}
