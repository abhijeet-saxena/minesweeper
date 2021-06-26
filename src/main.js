import "./styles/style.css";
import Minesweeper from "./scripts/Minesweeper";

const gameSettings = {
  easy: {
    rows: 10,
    columns: 10,
    mines: 10,
  },
  medium: {
    rows: 15,
    columns: 15,
    mines: 40,
  },
  hard: {
    rows: 20,
    columns: 20,
    mines: 99,
  },
};

const { rows, columns, mines } = gameSettings.easy;

let game = new Minesweeper(rows, columns, mines);
game.init();

window.onload = function () {
  const difficulty = document.querySelector("#difficulty");
  const board = document.querySelector("#board");

  const revealTile = ({ target }) => {
    if (!target.classList.contains("cell")) return;
    const { x, y } = target.dataset;

    const { revealed, gameOver } = game.openCell(
      parseInt(x, 10),
      parseInt(y, 10)
    );

    if (gameOver) {
      target.dataset.val = "💣";
      target.innerHTML = "💣";

      revealed.forEach((item, index) => {
        const tile = board.querySelector(`:nth-child(${item + 1})`);
        setTimeout(() => {
          tile.dataset.val = "💣";
          tile.innerHTML = "💣";
          if (index >= revealed.length - 1) alert("Game Over");
        }, index * 200);
      });
      return;
    } else {
      const openedTiles = game.board.flat().reduce((acc, item) => {
        return (acc += item.isRevealed ? 1 : 0);
      }, 0);

      for (let cell of revealed) {
        const tile = board.querySelector(
          `:nth-child(${cell.x * game.ROWS + cell.y + 1})`
        );
        tile.dataset.val = cell.value;
        tile.innerHTML = cell.value || "";
      }
    }
  };

  const generateBoard = (arr, columns) => {
    let op = "";

    for (let cell of arr) {
      op += `<div class="cell" data-x="${cell.x}" data-y="${cell.y}"></div>`;
    }

    board.innerHTML = op;
    board.style.width = `calc(${
      columns * document.querySelector(".cell").clientWidth
    }px + ${(columns - 1) * 4}px)`;
    game.printBoard();
  };

  generateBoard(game.board.flat(), game.COLUMNS);

  board.addEventListener("click", revealTile);

  difficulty.addEventListener("change", ({ target: { value } }) => {
    const { rows, columns, mines } = gameSettings[value];
    game = new Minesweeper(rows, columns, mines);
    game.init();
    generateBoard(game.board.flat(), columns);
  });
};
