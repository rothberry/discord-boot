const { MessageEmbed } = require("discord.js")

module.exports = {
	name: "skip",
	description: "Skips current song",
	execute: async (client, message, amount = 1) => {
		// todo find connection
		const myGuild = message.member.voice.channel.guild
		const queue = client.player.getQueue(myGuild)
		if (!queue) return await message.reply("THERE ARE NO ONGS!")

		// TODO can skip ahead multiple tracks
		await queue.skip()

		// debugger
		let embed = new MessageEmbed()
			.setTitle(`Now Playing: ${queue.tracks[0].title}`)
			.setThumbnail(queue.tracks[0].thumbnail)
			.setDescription(`Skipped: ${queue.current.title}`)

		// let skippedArray = queue.tracks.slice(0, amount)
		// for (let i = 0; i < amount; i++) {
		// 	// skippedArray.push(queue.nowPlaying())
		// 	await queue.skip()
		// }

		// const np = queue.tracks[amount - 1]
		// let embed = new MessageEmbed()
		// 	.setTitle(`Now Playing: ${np.title}`)
		// 	.setThumbnail(np.thumbnail)
		// 	.setDescription(`Skipped ${amount} tracks`)
		// 	.setFooter({ text: skippedArray.join("\n") })

		await message.reply({
			embeds: [embed],
		})
	},
}
