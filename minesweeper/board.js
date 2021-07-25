const { createCanvas, loadImage } = require("canvas");
const { readdirSync } = require("fs");
const Cell = require("./cell");

class Board {
	constructor(size, mines) {
		this.size = size;
		this.mines = mines;

		this.minesArray = [];

		this.initBoard();
		this.placeMines();
		this.placeNumbers();

	}

	initBoard() {
		this.boardArray = [];

		for (let row = 0; row < this.size[0]; row++) {
			let rowArray = [];

			for (let col = 0; col < this.size[1]; col++) {
				let cell = new Cell("empty_clicked");
				rowArray.push(cell);
			}

			this.boardArray.push(rowArray);
		}
	}

	getCellAt(x, y) {
		return this.boardArray[x][y];
	}

	selectCellAt(letter, number) {
		let lettersArray = "abcdefghijklmnopqrstuvwxyz";
		lettersArray = lettersArray.split("");

		let lettersObject = {};

		lettersArray.forEach((l, i) => {
			lettersObject[l] = [i];
		});

		return this.getCellAt(lettersObject[letter], number - 1);
	}

	placeMines() {
		for (let mine = 0; mine < this.mines; mine++) {
			let x = Math.floor(Math.random() * this.size[0]);
			let y = Math.floor(Math.random() * this.size[1]);

			let cell = this.getCellAt(x, y);

			if (cell.isMine) {
				mine--;
				continue;
			}

			cell.name = "mine";
			cell.isMine = true;

			this.minesArray.push([x, y]);
		}
	}

	isValidCell(x, y) {
		return (x >= 0 && x < this.size[0]) && (y >= 0 && y < this.size[1])
	}

	getNeighbours(x, y) {
		const neighbourCoords = [[-1, 1], [0, 1], [1, 1], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1]];
		let neighboursArray = [];

		neighbourCoords.forEach((coord) => {
			if (!this.isValidCell(x + coord[0], y + coord[1])) {
				neighboursArray.push(false);
			}
			else {
				neighboursArray.push(this.getCellAt(x + coord[0], y + coord[1]));
			}
		});

		return neighboursArray;
	}

	placeNumbers() {
		this.minesArray.forEach((mine) => {
			this.getNeighbours(mine[0], mine[1]).forEach((neighbour) => {
				if (neighbour && !neighbour.isMine) {
					neighbour.value++;
					neighbour.name = neighbour.value;
				}
			});
		});
	}

	async drawImage() {
		const canvas = createCanvas(512, 512);
		const ctx = canvas.getContext("2d");

		const imagesObject = {};

		// load images from assets folder
		readdirSync("./assets").forEach(async (file) => {
			let loadedImage = loadImage(`./assets/${file}`);
			imagesObject[file.split(".")[0]] = loadedImage;
		});

		// size of each cell
		let size = Math.min(512 / (this.size[0] + 1), 512 / (this.size[1] + 1));
		let pos = [0, 0];

		for (let row = -1; row < this.size[0]; row++) {
			let image = await imagesObject["edge"];
			ctx.drawImage(image, pos[0], pos[1], size, size);
			pos = [pos[0] + size, pos[1]];

			for (let col = 0; col < this.size[1]; col++) {
				if (row === -1) {
					let image = await imagesObject["edge"];
					ctx.drawImage(image, pos[0], pos[1], size, size);
					pos = [pos[0] + size, pos[1]];
					continue;
				}

				let cell = this.getCellAt(row, col);
				let image = await imagesObject[cell.name];

				ctx.drawImage(image, pos[0], pos[1], size, size);
				pos = [pos[0] + size, pos[1]];
			}

			pos = [0, pos[1] + size];
		}

		return canvas.toBuffer();
	}
}

module.exports = Board;