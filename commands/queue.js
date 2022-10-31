const { EmbedBuilder } = require("discord.js")

module.exports = {
	name: "queue",
	description: "Shows the queue. !queue <amount of tracks> will show that many tracks in the queue",
	execute: async (client, message, amount = null) => {
		// todo find connection
		const myGuild = message.member.voice.channel.guild
		const queue = client.player.getQueue(myGuild)
		if (!queue) return await message.reply("THERE ARE NO ONGS!")

		let mappedTracks = queue.tracks.map((t, i) => `${i + 1}:\t ${t.title}`)
		// mappedTracks.unshift(`Now Playing: ${queue.nowPlaying().title}`)
		// debugger

		// message.reply(mappedTracks.join("\n"))

		// todo maybe not show all queue, just x amount of tracks
		const np = queue.nowPlaying()

		if (!amount) {
			amount = mappedTracks.length
		}
		let embed = new EmbedBuilder()
			.setTitle(np.title)
			.setURL(np.url)
			.setThumbnail(np.thumbnail)
			.setDescription(mappedTracks.slice(0, amount).join("\n"))
			.setFooter({ text: `${queue.tracks.length} tracks left` })

		await message.reply({
			embeds: [embed],
		})
	},
}
