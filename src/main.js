import Minesweeper from "./Minesweeper";

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

window.onload = function () {
  const difficulty = document.querySelector("#difficulty");
  const board = document.querySelector("#board");
  const end = document.querySelector(".game-over");
  const timerDisplay = document.querySelector("#timer");
  const finishStatus = end.querySelector("h1");
  const finishTime = document.querySelector(".finish-time");
  let timer = null;
  let game = null;

  const revealTile = ({ target }) => {
    if (!target.classList.contains("cell")) return;
    const { x, y } = target.dataset;

    const { revealed, gameOver } = game.openCell(
      parseInt(x, 10),
      parseInt(y, 10)
    );

    if (gameOver) {
      clearInterval(timer);
      target.innerHTML = "💣";

      revealed.forEach((item, index) => {
        const tile = board.querySelector(`:nth-child(${item + 1})`);
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

      if (openedTiles + game.mines === game.ROWS * game.COLUMNS) {
        clearInterval(timer);
        finishStatus.innerHTML = "You Win !!! ✌️";
        end.querySelector("#retry").innerHTML = "New Game";
        end.style.top = 0;
      }

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
    game.printBoard();
  };

  const startGame = () => {
    const { rows, columns, mines } = gameSettings[difficulty.value];
    game = new Minesweeper(rows, columns, mines);
    game.init();
    finishStatus.style.display = "block";
    timerDisplay.innerHTML = `<strong>⏰ Time </strong> 00:00`;
    finishTime.innerHTML = `⏰ 00:00`;
    generateBoard(game.board.flat(), columns);
  };

  board.addEventListener("click", revealTile);

  difficulty.addEventListener("change", () => {
    clearInterval(timer);
    finishStatus.innerHTML = "Start Game";
    finishStatus.style.display = "none";
    finishTime.style.display = "none";
    end.style.top = "0";
  });

  document.querySelector("#retry").addEventListener("click", () => {
    startGame();
    end.style.top = "100%";
    finishTime.style.display = "block";
  });
};
