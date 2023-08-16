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

		const song = queue.nowPlaying()
		const { title, url, thumbnail } = song

		// TODO make progressbar fit all widths
		let bar = queue.createProgressBar({
			queue: true,
			timecodes: true,
			length: 10,
		})

		let embed = new EmbedBuilder()
			.setThumbnail(thumbnail)
			.setDescription(`Currently Playing: [${title}](${url})\n\n` + bar)
			.setFooter({ text: "Volume at " + queue.volume })
			.setColor("Gold")

		await interaction.channel.send({ embeds: [embed] })
		await interaction.deleteReply()
	},
}
