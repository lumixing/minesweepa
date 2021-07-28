const Main = require("../minesweeper/main");

module.exports.run = async (msg, args) => {
	msg.channel.bulkDelete(100, true);
}
module.exports.meta = {
	name: "clear",
	aliases: ["cl"],
	description: "clear messages from channel",
	argsRequired: false,
}