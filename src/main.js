import "./styles/style.css";
import Minesweeper from "./scripts/Minesweeper";

const ROWS = 10;
const COLUMNS = 10;

const board = document.querySelector("#board");

const colorMap = {};

const game = new Minesweeper(ROWS, COLUMNS, 21);
game.init();
game.printBoard();
// console.log(game.board);

const generateBoard = (arr) => {
  // console.log(arr);
  let op = "";

  for (let cell of arr) {
    console.log(cell);
    op += `<div class="cell">${cell.value}</div>`;
  }
  // board.style.width =

  board.innerHTML = op;
};

generateBoard(game.board.flat());
