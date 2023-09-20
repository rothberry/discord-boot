const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Shows info on current song"),
	execute: async (interaction) => {
		const { client, guild } = interaction
		const queue = client.player.queues.get(guild)
		if (!queue) return await message.reply("THERE ARE NO ONGS!")

		await interaction.deferReply()

		const song = queue.currentTrack
		const { title, url, thumbnail, author } = song
		// TODO make progressbar fit all widths
		let bar = queue.node.createProgressBar({
			queue: true,
			timecodes: true,
			length: 10,
		})

		let embed = new EmbedBuilder()
			.setThumbnail(thumbnail)
			.setDescription(
				`Currently Playing: [${author ? author + " - " : null}${title}](${url})\n\n` + bar
			)
			.setFooter({ text: "Volume at " + queue.node.volume })
			.setColor("Gold")

		await interaction.channel.send({ embeds: [embed] })
		await interaction.deleteReply()
	},
}
