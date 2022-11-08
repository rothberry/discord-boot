const { EmbedBuilder } = require("discord.js")

module.exports = {
	name: "skip",
	description: "Skips current song",
	execute: async (client, message, amount) => {
		// todo find connection
		const myGuild = message.member.voice.channel.guild
		const queue = client.player.getQueue(myGuild)
		if (!queue) return await message.reply("THERE ARE NO ONGS!")

		const skippedTrack = queue.nowPlaying()
		await queue.skipTo(amount - 1)
		const skippedTo = await queue.tracks[0]

		// debugger
		let embed = new EmbedBuilder()
			.setTitle(`Now Playing: ${skippedTo.title}`)
			.setThumbnail(skippedTo.thumbnail)
			.setDescription(`Skipped: ${skippedTrack.title}`)

		await message.reply({
			embeds: [embed],
		})
	},
}
