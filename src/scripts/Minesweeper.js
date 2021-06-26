class Minesweeper {
  constructor(rows, cols, mines) {
    this.ROWS = rows;
    this.COLUMNS = cols;
    this.board = [];
    this.mines = mines;
    this.mineLocations = new Set();
    this.revealedCount = 0;
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
          value: null,
        });
      }
      this.board.push(row);
    }

    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLUMNS; j++) {
        if (!this.board[i][j].isMine)
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

  getAdjacentCells(row, col) {
    const adj = [];

    for (let i = -1; i < 2; i++) {
      const currentRow = this.board[row + i];

      if (currentRow) {
        let left = currentRow[col - 1];
        let middle = currentRow[col];
        let right = currentRow[col + 1];

        if (left && !left.isMine) adj.push(left);

        if (i !== 0 && middle && !middle.isMine) adj.push(middle);

        if (right && !right.isMine) adj.push(right);
      }
    }

    return adj;
  }

  recursivelyOpenCells(row, col) {
    let op = [];
    let queue = [this.board[row][col]];

    while (queue.length) {
      const popped = queue.shift();
      const adj = this.getAdjacentCells(popped.x, popped.y);

      for (let item of adj) {
        if (!item.isRevealed) {
          op.push(item);
          if (item.value === 0) {
            queue.push(item);
          }
          item.isRevealed = true;
          this.revealedCount += 1;
        }
      }
    }

    return op;
  }

  openCell(row, col) {
    const { isMine, value, x, y } = this.board[row][col];
    if (isMine) return { gameOver: true, revealed: [...this.mineLocations] };
    if (value !== 0) {
      this.revealedCount += 1;
      return {
        gameOver: false,
        revealed: [{ value, x, y }],
        count: this.revealedCount,
      };
    }

    const revealed = [{ value, x, y }, ...this.recursivelyOpenCells(row, col)];

    return { gameOver: false, revealed, count: this.revealedCount };
  }
}

export default Minesweeper;
