module.exports = {
	name: "seek",
	description: "seeks ahead (WIP)",
	execute: async (client, message, amount) => {
		const myGuild = message.member.voice.channel.guild
		const queue = client.player.getQueue(myGuild)
		if (!queue) return await message.reply("THERE ARE NO ONGS!")

		let ts = queue.getPlayerTimestamp()
		const { current, end, progress } = ts
		console.log({ ts })
		await queue.seek(300)
		ts1 = queue.getPlayerTimestamp()
		await console.log({ ts1 })

		// debugger
	},
}
