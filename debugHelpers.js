const starLine = (char = "*") => {
	const tWidth = process.stdout.columns
	console.log(new Array(tWidth).fill(char).join(""))
}

const starWrap = (log, char = "*") => {
	starLine(char)
	console.log(log)
	starLine(char)
}

const starMid = (text, char = "*") => {
	const tWidth = process.stdout.columns
	const halfSize = parseInt((tWidth - text.length - 2) / 2)
	const halfStars = new Array(halfSize).fill(char).join("")
	console.log(`${halfStars} ${text} ${halfStars}`)
}

module.exports = { starLine, starWrap, starMid }
