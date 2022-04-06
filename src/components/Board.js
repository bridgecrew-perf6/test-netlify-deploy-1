import React from 'react';
import Square from './Square';

function Board({ winLine, squares, onClick, boardSize }) {
  let squaresNewArr = [];
  for (let i = 0; i < boardSize; ++i) {
    let row = [];
    for (let j = 0; j < boardSize; ++j) {
      let index = i * boardSize + j;
      let isWinSquare = winLine && winLine.includes(index);
      row.push(renderSquare(isWinSquare, index, squares[index], onClick));
    }
    squaresNewArr.push(<div key={i} className="board-row">{row}</div>);
  }
  return (
    <div>{squaresNewArr}</div>
  );
}

/**
 * Render a square at specific position in squares list and Highlight win squares
 * @param {*} isWinSquare wheter this square in win squares
 * @param {*} i position in squares
 * @param {*} value value of that square (X, O, "")
 * @param {*} onClick fil value in square ('X', 'O')
 * @returns Squares component
 */
function renderSquare(isWinSquare, i, value, onClick) {
  return (
    <Square
      highlight={isWinSquare}
      key={i}
      value={value}
      onClick={() => onClick(i)}
    />
  );
}

export default Board;