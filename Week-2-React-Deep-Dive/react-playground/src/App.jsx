import React, { useState } from 'react';
import './App.css';

// [A. Square Component]
function Square({ value, onSquareClick }) {
  return (
    <button onClick={onSquareClick} className={`square ${value ? `square-${value.toLowerCase()}` : ''}`}>
      {value}
    </button>
  );
}

// [B. Board Component]
function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  let status;
  if (winner) {
    status = `Winner: ${winner} 🏆`;
  } else if (isDraw) {
    status = 'Draw Game 🤝';
  } else {
    status = `Next Player: ${xIsNext ? 'X' : 'O'}`;
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  return (
    <div>
      <div className={`status-banner ${winner ? 'winner-status' : ''}`}>
        {status}
      </div>
      <div className="board-grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  );
}

// [C. Root Tic-Tac-Toe Controller with History]
function TicTacToeGame() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  return (
    <div className="game-container">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-history">
        <h4 className="history-title">🕰️ Time Travel (History)</h4>
        <ol className="history-list">
          {history.map((_, move) => {
            const isCurrent = move === currentMove;
            return (
              <li key={move}>
                <button 
                  onClick={() => jumpTo(move)}
                  className={`btn-history ${isCurrent ? 'active-history' : ''}`}
                >
                  {move > 0 ? `Go to move #${move}` : 'Go to game start'} {isCurrent && '📍'}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// [D. Main App Layout]
export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="main-title">🎮 Tic-Tac-Toe Game</h1>
        <p className="subtitle">React Component Memory, State Lifting & Immutability</p>
      </header>

      <main className="dashboard-grid">
        <div className="card game-card">
          <h2 className="card-title">Play Arena</h2>
          <p className="card-description">Click on any square to play. Use the right timeline to undo/redo moves.</p>
          <TicTacToeGame />
        </div>
      </main>
    </div>
  );
}
