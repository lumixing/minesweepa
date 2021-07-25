const Main = require("../minesweeper/main");

module.exports.run = async (msg, args) => {
	new Main(msg, msg.client.games);
}
module.exports.meta = {
	name: "creategame",
	aliases: ["cg"],
	description: "creates a game",
	argsRequired: false,
}