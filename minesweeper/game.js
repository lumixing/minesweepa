const Board = require("./board");
const { MessageAttachment, MessageEmbed } = require("discord.js");

class Game {
	constructor(msg) {
		this.msg = msg;
		this.board = new Board([16, 16], 51);

		this.sendBoard(msg);
	}

	async sendBoard(msg) {
		let image = await this.board.drawImage();
		let attachment = new MessageAttachment(image, "board.png");

		let embed = new MessageEmbed()
			.setTitle("minesweepa")
			.attachFiles(attachment)
			.setImage('attachment://board.png');

		msg.channel.send(embed)
			.then((m) => {
				console.log(`[${m.createdTimestamp - this.msg.createdTimestamp}ms] sent image`);
			})
	}
}

module.exports = Game;