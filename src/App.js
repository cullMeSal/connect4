import './App.css';
import { useState } from 'react';

let turn = 0;

function App() {
  
  const cellColorYellow = '#fffb00ff';
  const cellColorRed = '#e70303ff';
  const cellColorEmpty = '#fdfdfdfd';

  const [matrix, setMatrix] = useState(
    Array.from({ length: 6 }, () => Array(7).fill(0))
  );

  const updateMatrixCell = (row, col, newValue) =>{
    if (row === -1) return; // Column is full, do nothing
    
    turn++;
    console.log(turn);

    setMatrix(prev => {
    const copy = prev.map(row => [...row]); // deep copy
    copy[row][col] = newValue;

    console.log('Updated Matrix:', copy);

    const winner = checkWinner(copy, row, col);
    console.log('Winner:', winner);
    if (winner !== 0) {
      setTimeout(() => {
        alert(`Player ${winner === 1 ? 'Red' : 'Yellow'} wins!`);
        resetGame();
      }, 100);
    }
    return copy;
  });  
  };

  const resetGame = () => {
    turn = 0;
    setMatrix(
      Array.from({ length: 6 }, () => Array(7).fill(0))
    );
  };

  function checkWinner(matrix, rowIndex, colIndex) {
    const directions = ['horizontal', 'vertical', 'diagonal-up', 'diagonal-down'];
    for (const direction of directions) {
      const cells = getCellsInALine(matrix, rowIndex, colIndex, direction);
      let count = 0;
      let lastValue = 0;

      console.log(direction, cells);

      for (const cell of cells) {
        if (cell !== 0 && cell === lastValue) {
          count++;
          if (count === 4) {
            return cell; // Return the winner (1 or -1)
          }
        } else {
          count = 1;
          lastValue = cell;
        }
      }
    }
    return 0; // No winner
  }
  function getCellsInALine(matrix, row, col, direction) {
    // direction: 'horizontal', 'vertical', 'diagonal-up', 'diagonal-down'
    const left = col - 3 < 0 ? 0 : col - 3;
    const right = col + 3 > 6 ? 6 : col + 3;
    const top = row - 3 < 0 ? 0 : row - 3;
    const bottom = row + 3 > 5 ? 5 : row + 3;

    if (direction === 'horizontal') {
      const cells = [];
      for (let c = left; c <= right; c++) {
        cells.push(matrix[row][c]);
      }
      return cells;
    } else if (direction === 'vertical') {
      const cells = [];
      for (let r = top; r <= bottom; r++) {
        cells.push(matrix[r][col]);
      } 
      return cells;
    }
    else if (direction === 'diagonal-up') {
      const cells = [];
      for (let offset = -3; offset <= 3; offset++) {
        const r = row - offset;
        const c = col + offset;
        if (r >= 0 && r <= 5 && c >= 0 && c <= 6) {
          cells.push(matrix[r][c]);
        }
      }
      return cells;
    } else if (direction === 'diagonal-down') {
      const cells = [];
      for (let offset = -3; offset <= 3; offset++) {
        const r = row + offset;
        const c = col + offset;
        if (r >= 0 && r <= 5 && c >= 0 && c <= 6) {
          cells.push(matrix[r][c]);
        }
      }
        return cells;
      }
  }


  function getNextZeroRow(col) {
    for (let row = matrix.length - 1; row >= 0; row--) {
      if (matrix[row][col] === 0) {
        return row;
      }
    }
    return -1; // Column is full
  }

  return (
    <div className="App">
      <p>Connect 4</p>
      <div className='board'>
        {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className='row'>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              onClick={() => updateMatrixCell(getNextZeroRow(colIndex), colIndex, turn % 2 === 0 ? 1 : -1)}
              className='row-content'
              style={{
                backgroundColor: cell === 1 ? cellColorRed : cell === -1 ? cellColorYellow : cellColorEmpty,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: cell === 1 ? cellColorRed : cell === -1 ? cellColorYellow : cellColorEmpty
              }}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
      </div>
      
      <div style={{
        height: 50,
        width: '50px',
        borderRadius: '50%',
        border: '1px solid black',
        backgroundColor: turn % 2 === 0 ? 'red' : 'yellow'
      }}></div>
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
}

export default App;
