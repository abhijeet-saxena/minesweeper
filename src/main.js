import "./styles/style.css";
import Minesweeper from "./scripts/Minesweeper";

document.querySelector("#app").innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;

const game = new Minesweeper(3, 3, 2);
game.init();
game.printBoard();
console.log(game.board);
