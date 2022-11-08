module.exports = {
	name: "resume",
	description: "Resumes paused track",
	execute: async (client, message) => {
		const myGuild = message.member.voice.channel.guild
		const queue = client.player.getQueue(myGuild)
		if (!queue) return await message.reply("THERE ARE NO ONGS!")

		queue.setPaused(false)
		message.reply("Resumed...")
	},
}
