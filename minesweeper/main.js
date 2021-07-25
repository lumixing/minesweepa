const Game = require("./game");

class Main {
	constructor(msg, games) {
		this.msg = msg;
		this.games = games;

		this.server = this.msg.guild;
		this.player = this.msg.author;

		// if (this.alreadyInGame()) {
		// 	msg.reply("you are already in a game!");
		// 	return;
		// }

		this.initGame();

		const game = new Game(msg);
	}

	alreadyInGame() {
		if (!(this.server.id in this.games)) {
			return false;
		}

		if (!(this.player.id) in this.games[this.server.id]) {
			return false;
		}

		return true;
	}

	initGame() {
		if (!(this.server.id in this.games)) {
			this.games[this.server.id] = {};
			console.log(`init server (${this.server.id})`);
		}

		this.games[this.server.id][this.player.id] = this;
		console.log(`init game (${this.server.id}.${this.player.id})`);
	}
}

module.exports = Main;