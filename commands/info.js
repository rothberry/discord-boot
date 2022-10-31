const { EmbedBuilder } = require("discord.js")

module.exports = {
	name: "info",
	description: "Shows Now playing",
	execute: async (client, message) => {
		// todo find connection
		const myGuild = message.member.voice.channel.guild
		const queue = client.player.getQueue(myGuild)
		if (!queue) return await message.reply("THERE ARE NO ONGS!")

		const song = queue.nowPlaying()
		const { title, url, thumbnail, duration } = song
		// console.log(song)
		// console.log(queue)

		// TODO make prgoressbar fit all widths
		let bar = queue.createProgressBar({
			queue: false,
			timecodes: true,
			length: 10,
		})
		let embed = new EmbedBuilder()
			.setThumbnail(thumbnail)
			.setDescription(`Currently Player: [${title}](${url})\n\n` + bar)

		await message.reply({
			embeds: [embed],
		})
	},
}
