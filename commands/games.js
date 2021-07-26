const Main = require("../minesweeper/main");

module.exports.run = async (msg, args) => {
	console.log(msg.client.games);

	let serverCount = 0;
	let gameCount = 0;

	for (let server in msg.client.games) {
		serverCount++;
		for (let username in msg.client.games[server]) {
			gameCount++;
		}
	}

	msg.reply(`currently ${gameCount} game${gameCount === 1 ? "" : "s"} across ${serverCount} server${serverCount === 1 ? "" : "s"}`);
}
module.exports.meta = {
	name: "games",
	aliases: ["gm"],
	description: "shows bot.games object",
	argsRequired: false,
}