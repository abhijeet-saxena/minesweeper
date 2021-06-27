class Minesweeper {
  constructor(rows, cols, mines) {
    this.startTime = Date.now(); // used for timer
    this.ROWS = rows; // rows in board
    this.COLUMNS = cols; // columns in board
    this.board = []; // holds the content of board
    this.mines = mines; // max number of mines for this board
    this.mineLocations = new Set(); // location of each mine
  }

  init() {
    // Add random mine locations
    while (this.mineLocations.size !== this.mines) {
      this.mineLocations.add(
        Math.floor(Math.random() * this.ROWS * this.COLUMNS)
      );
    }

    // Generate the board content
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

  // Helper method to print out the board
  printBoard() {
    for (let i = 0; i < this.ROWS; i++) {
      let rowText = "";
      for (let j = 0; j < this.COLUMNS; j++) {
        rowText += ` ${
          this.board[i][j].isMine ? "◉" : this.board[i][j].value
        } `;
      }
      console.log(`${rowText}\n`);
    }
  }

  // Calculate number of mines around each cell and store that number
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

  // Returns a list of adjacent cells
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

  // Helper function to keep opening all cells that are not mines
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
        }
      }
    }

    return op;
  }

  // Open each cell and return status of that move
  openCell(row, col) {
    const { isMine, value, x, y } = this.board[row][col];

    if (isMine) {
      const cells = this.board.flat(2).filter((item) => item.isMine);
      return { gameOver: true, revealed: [...cells] };
    }

    if (value !== 0) {
      this.board[row][col].isRevealed = true;
      return {
        gameOver: false,
        revealed: [{ value, x, y }],
      };
    }

    return {
      gameOver: false,
      revealed: [{ value, x, y }, ...this.recursivelyOpenCells(row, col)],
    };
  }
}

export default Minesweeper;
