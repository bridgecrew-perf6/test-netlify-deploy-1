import React, { useState } from "react";
import Board from "./Board";

function Game() {
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null),
    latestMoveSquare: null,
  }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isAscending, setIsAscending] = useState(true);
  const [boardSize, setBoardSize] = useState(5);

  function handleClick(i) {
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[currentHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, boardSize).winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory(history.concat([
      {
        squares: squares,
        latestMoveSquare: i,
      }
    ]));
    setStepNumber(currentHistory.length);
    setXIsNext(!xIsNext);
  }

  function handleSize(s) {
    setBoardSize(s.target.value);
    setHistory([{
      squares: Array(Math.pow(Math.floor(s.target.value), 2)).fill(null),
      latestMoveSquare: null,
    }]);
    setStepNumber(0);
    setXIsNext(true);
  }

  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  }

  function handleSortToggle() {
    setIsAscending(!isAscending);
  }

  const current = history[stepNumber];
  const winInfo = calculateWinner(current.squares, boardSize);
  const winner = winInfo.winner;
  let moves = history.map((step, move) => {
    const latestMoveSquare = step.latestMoveSquare;
    const col = 1 + latestMoveSquare % boardSize;
    const row = 1 + Math.floor(latestMoveSquare / boardSize);
    const desc = move ?
      `Go to move (${col}, ${row})` :
      'Go to game start';
    return (
      <li key={move}>
        {/* Bold the currently selected item */}
        <button
          className={move === stepNumber ? 'move-list-item-selected' : ''}
          onClick={() => jumpTo(move)}>{desc}
        </button>
      </li>
    );
  });

  let status;
  let classStatus = "status";
  if (winner) {
    status = "Winner: " + winner;
  } else {
    if (winInfo.isDraw) {
      status = "Draw";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
      classStatus = "";
    }
  }

  if (!isAscending) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={i => handleClick(i)}
          winLine={winInfo.line}
          boardSize={boardSize}
        />
      </div>
      <div className="game-info">
        <div className={classStatus}>{status}</div>
        <div className="size">
          <span>Size:</span>
          <input type="number" value={boardSize} onChange={(s) => handleSize(s)}></input>
        </div>
        <button onClick={() => handleSortToggle()}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, boardSize) {
  const winnerLine = boardSize >= 5 ? 5 : boardSize;
  const arrSquares = [...squares];
  const StoreArrToCheckWinner = [];

  for (let _ = 0; _ < boardSize; _++) {
    StoreArrToCheckWinner.push(arrSquares.splice(0, boardSize))
  }

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      // vertical
      let line = []
      for (let k = 0; k < winnerLine; k++) {
        if (i - k >= 0) {
          if (StoreArrToCheckWinner[i][j] &&
            StoreArrToCheckWinner[i][j] === StoreArrToCheckWinner[i - k][j]) {
            line.push(boardSize * (i - k) + j)
            if (k === winnerLine - 1)
              return {
                winner: StoreArrToCheckWinner[i][j],
                line: line,
                isDraw: false,
              }
            continue
          } else {
            line = [];
            break
          }
        } else {
          line = [];
          break
        }
      }
      // upper right cross
      for (let k = 0; k < winnerLine; k++) {
        if (i - k >= 0 && j + k < boardSize) {
          if (StoreArrToCheckWinner[i][j] &&
            StoreArrToCheckWinner[i][j] === StoreArrToCheckWinner[i - k][j + k]) {
            line.push(boardSize * (i - k) + (j + k))
            if (k === winnerLine - 1)
              return {
                winner: StoreArrToCheckWinner[i][j],
                line: line,
                isDraw: false,
              }
            continue
          } else {
            line = [];
            break
          }
        } else {
          line = [];
          break
        }
      }
      // horizontal
      for (let k = 0; k < winnerLine; k++) {
        if (j + k < boardSize) {
          if (StoreArrToCheckWinner[i][j] &&
            StoreArrToCheckWinner[i][j] === StoreArrToCheckWinner[i][j + k]) {
            line.push(boardSize * i + j + k)
            if (k === winnerLine - 1)
              return {
                winner: StoreArrToCheckWinner[i][j],
                line: line,
                isDraw: false,
              }
            continue
          } else {
            line = []; break
          }
        } else {
          line = [];
          break
        }
      }
      // lower right cross
      for (let k = 0; k < winnerLine; k++) {
        if (i + k < boardSize && j + k < boardSize) {
          if (StoreArrToCheckWinner[i][j] &&
            StoreArrToCheckWinner[i][j] === StoreArrToCheckWinner[i + k][j + k]) {
            line.push(boardSize * (i + k) + (j + k))
            if (k === winnerLine - 1)
              return {
                winner: StoreArrToCheckWinner[i][j],
                line: line,
                isDraw: false,
              }
            continue
          } else break
        } else break
      }
    }
  }

  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }

  return {
    winner: null,
    line: null,
    isDraw: isDraw,
  };
}

export default Game;