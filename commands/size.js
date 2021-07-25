const Main = require("../minesweeper/main");

module.exports.run = async (msg, args) => {
	const id = args[0];
	let smsg = await msg.channel.messages.cache.get(id);
	msg.reply(smsg.content.length);
}
module.exports.meta = {
	name: "size",
	aliases: ["sz"],
	description: "gets size of message",
	argsRequired: true,
}