import "./styles/style.css";
import Minesweeper from "./scripts/Minesweeper";

const ROWS = 10;
const COLUMNS = 10;

const game = new Minesweeper(ROWS, COLUMNS, 10);
game.init();
// game.printBoard();

const showTile = () => {};

const revealTile = ({ target }) => {
  if (!target.classList.contains("cell")) return;
  let { x, y } = target.dataset;
  x = parseInt(x, 10);
  y = parseInt(y, 10);

  const { revealed, gameOver } = game.openCell(x, y);
  if (gameOver) console.log("Game Over");
  // console.log(data);

  for (let cell of revealed) {
    const tile = board.querySelector(
      `:nth-child(${cell.x * ROWS + cell.y + 1})`
    );
    tile.classList.add("revealed");
    tile.innerHTML = cell.value || "";
  }
};

const board = document.querySelector("#board");
board.addEventListener("click", revealTile);

const generateBoard = (arr) => {
  // console.log(arr);
  let op = "";

  for (let cell of arr) {
    op += `
    <div class="cell" data-x="${cell.x}" data-y="${cell.y}">
      ${cell.isRevealed ? (cell.isMine ? "◉" : cell.value || "") : ""}
    </div>`;
  }

  board.innerHTML = op;
};

generateBoard(game.board.flat());
