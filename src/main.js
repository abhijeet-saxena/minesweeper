import Minesweeper from "./Minesweeper";

// Predefined game settings, we can also have custom rows/columns/mines
const gameSettings = {
  easy: {
    rows: 10,
    columns: 10,
    mines: 15,
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

// Run function once DOM is loaded
window.onload = function () {
  // Selectors
  const difficulty = document.querySelector("#difficulty");
  const board = document.querySelector("#board");
  const end = document.querySelector(".game-over");
  const timerDisplay = document.querySelector("#timer");
  const finishStatus = end.querySelector("h1");
  const finishTime = document.querySelector(".finish-time");

  // Global variables
  let timer = null; // Holds timer
  let game = null; // Main game variable

  // Handles game state on opening a tile
  const revealTile = ({ target }) => {
    if (!target.classList.contains("cell")) return;
    const { x, y } = target.dataset;

    const { revealed, gameOver } = game.openCell(
      parseInt(x, 10),
      parseInt(y, 10)
    );

    if (gameOver) {
      // Lose Scenario
      clearInterval(timer);
      target.innerHTML = "💣";
      revealed.forEach((cell, index) => {
        const tile = board.querySelector(
          `:nth-child(${cell.x * game.COLUMNS + cell.y + 1})`
        );
        setTimeout(() => {
          tile.dataset.val = "💣";
          tile.innerHTML = "💣";
          if (index === revealed.length - 1) {
            finishStatus.innerHTML = "You Lost !!! 👎";
            end.querySelector("#retry").innerHTML = "Retry";
            end.style.top = 0;
          }
        }, index * 200);
      });
      return;
    } else {
      const openedTiles = game.board.flat().reduce((acc, item) => {
        return (acc += item.isRevealed ? 1 : 0);
      }, 0);

      // Win Scenario
      if (openedTiles + game.mines === game.ROWS * game.COLUMNS) {
        clearInterval(timer);
        finishStatus.innerHTML = "You Win !!! ✌️";
        end.querySelector("#retry").innerHTML = "New Game";
        end.style.top = 0;
      }

      // Reveal all eligible tiles
      for (let cell of revealed) {
        const tile = board.querySelector(
          `:nth-child(${cell.x * game.COLUMNS + cell.y + 1})`
        );
        tile.dataset.val = cell.value;
        tile.innerHTML = cell.value || "";
      }
    }
  };

  // Generate the Minesweeper board
  const generateBoard = (arr, columns) => {
    board.innerHTML = arr.reduce(
      (acc, cell) =>
        acc + `<div class="cell" data-x="${cell.x}" data-y="${cell.y}"></div>`,
      ""
    );

    board.style.width = `calc(${
      columns * document.querySelector(".cell").clientWidth
    }px + ${(columns - 1) * 2}px)`;

    timer = setInterval(() => {
      const diff = Math.floor((Date.now() - game.startTime) / 1000);
      const min = Math.floor(diff / 60)
        .toString()
        .padStart(2, "0");
      const sec = Math.floor(diff % 60)
        .toString()
        .padStart(2, "0");

      timerDisplay.innerHTML = `<strong>⏰ Time</strong> ${min}:${sec}`;
      finishTime.innerHTML = `⏰ ${min}:${sec}`;
    }, 1000);

    // DEBUG: shows the board in console, not needed in PROD
    game.printBoard();
  };

  // Start a new game
  const startNewGame = () => {
    const { rows, columns, mines } = gameSettings[difficulty.value];
    game = new Minesweeper(rows, columns, mines);
    game.init();
    finishStatus.style.display = "block";
    timerDisplay.innerHTML = `<strong>⏰ Time </strong> 00:00`;
    finishTime.innerHTML = `⏰ 00:00`;
    generateBoard(game.board.flat(), columns);
  };

  // Open tile on click
  board.addEventListener("click", revealTile);

  // Handle right-click to 🚩 a tile
  board.addEventListener("contextmenu", (event) => {
    if (!event.target.classList.contains("cell")) return;
    event.preventDefault();
    if (event.target.dataset.val === "🚩") {
      delete event.target.dataset.val;
      event.target.innerHTML = "";
    } else {
      event.target.dataset.val = "🚩";
      event.target.innerHTML = "🚩";
    }
  });

  // Handle difficulty change selection
  difficulty.addEventListener("change", () => {
    clearInterval(timer);
    finishStatus.innerHTML = "Start Game";
    finishStatus.style.display = "none";
    finishTime.style.display = "none";
    end.style.top = "0";
  });

  // Restart Logic
  document.querySelector("#retry").addEventListener("click", () => {
    startNewGame();
    end.style.top = "100%";
    finishTime.style.display = "block";
  });
};
