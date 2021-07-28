const Main = require("../minesweeper/main");

module.exports.run = async (msg, args) => {
	let channel = msg.channel;
	channel.clone();
	channel.delete();
}
module.exports.meta = {
	name: "nuke",
	aliases: ["nk"],
	description: "clones and deletes channel",
	argsRequired: false,
}