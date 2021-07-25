class Cell {
	constructor(name) {
		this.name = name.toString();
		this.isMine = false;
		this.value = 0;

		if (this.name === "mine") {
			this.isMine = true;
		}
	}
}

module.exports = Cell;