class Minesweeper {
  constructor(rows, cols, mines) {
    this.ROWS = rows;
    this.COLUMNS = cols;
    this.board = [];
    this.mines = mines;
    this.mineLocations = new Set();
  }

  init() {
    while (this.mineLocations.size !== this.mines) {
      this.mineLocations.add(
        Math.floor(Math.random() * this.ROWS * this.COLUMNS)
      );
    }

    for (let i = 0; i < this.ROWS; i++) {
      const row = [];
      for (let j = 0; j < this.COLUMNS; j++) {
        row.push({
          x: i,
          y: j,
          isMine: this.mineLocations.has(this.ROWS * i + j),
          isRevealed: false,
          value: 0,
        });
      }
      this.board.push(row);
    }

    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLUMNS; j++) {
        this.board[i][j].value = this.getValueAtCell(i, j);
      }
    }
  }

  printBoard() {
    for (let i = 0; i < this.ROWS; i++) {
      let rowText = "";
      for (let j = 0; j < this.COLUMNS; j++) {
        rowText += `  ${
          this.board[i][j].isMine ? "X" : this.board[i][j].value
        }  `;
      }
      console.log(`${rowText}\n`);
    }
  }

  getValueAtCell(row, col) {
    let value = 0;
    for (let i = -1; i < 2; i++) {
      const currentRow = this.board[row + i];

      if (currentRow) {
        if (currentRow[col - 1] && currentRow[col - 1].isMine) value += 1;
        if (currentRow[col] && currentRow[col].isMine) value += 1;
        if (currentRow[col + 1] && currentRow[col + 1].isMine) value += 1;
      }
    }
    return value;
  }
}

export default Minesweeper;
