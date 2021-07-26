const Board = require("./board");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const ch = require("chalk");
let log = console.log;

class Game {
	constructor(msg) {
		this.msg = msg;
		this.board = new Board([9, 9], 10);

		this.sendBoard(msg);
		this.awaitMessage(msg);
	}

	async sendBoard(msg) {
		let image = await this.board.drawImage();
		let attachment = new MessageAttachment(image, "board.png");

		let embed = new MessageEmbed()
			.setTitle("minesweepa")
			.attachFiles(attachment)
			.setImage('attachment://board.png');

		if (this.boardMessage) {
			await this.boardMessage.delete();
		}

		msg.channel.send(embed)
			.then((m) => {
				this.boardMessage = m;
			})
	}

	async awaitMessage(msg) {
		log(ch.blue("awaiting message..."));

		let filter = (m) => m.author.id === msg.author.id;
		let res = await msg.channel.awaitMessages(filter, { max: 1 });
		res = res.first().content;

		this.handleInput(res.toLowerCase());
	}

	handleInput(res) {
		if (res === "end" || res === "exit" || res === "quit") {
			log(ch.red("quitting game..."));
			this.endGame();
			this.msg.reply("ended game");
			return;
		}

		let letter = res[0];
		let number = res.substring(1);

		let [x, y] = this.board.alphanum2xy(letter, number);

		log(ch.magentaBright(`input coords: [${letter}, ${number}] (${x}, ${y})`));

		if (!this.board.isValidCell(x, y)) {
			log(ch.red("invalid cell, redoing awaitmsg..."));
			this.awaitMessage(this.msg);
			return;
		}

		log(ch.green("found cell, doing reveal"));
		this.revealCellAt(letter, number);
	}

	revealCellAt(letter, number) {
		let cell = this.board.selectCellAt(letter, number);
		cell.revealed = true;
		log(ch.green("revealed cell, redoing awaitmsg..."));
		this.sendBoard(this.msg);
		this.awaitMessage(this.msg);
	}

	endGame() {
		this.deleteGame(this.msg);
	}

	deleteGame(msg) {
		log(ch.red(`deleting ${msg.guild.id}.${msg.author.id}...`));
		delete msg.client.games[msg.guild.id][msg.author.id];
		log(ch.red(`deleted ${msg.guild.id}.${msg.author.id}!`));
	}
}

module.exports = Game;