/**
 * ==============================================================================================
 * ⚛️ Week 2 — Day 02: React State, useState Hook & Interactive Tic-Tac-Toe Game
 * ==============================================================================================
 * Comprehensive Practice Snippets:
 * 1. Counter & Form Input using useState
 * 2. Immutable Array & Object State Updates
 * 3. Lifting State Up Pattern
 * 4. Full Production Tic-Tac-Toe Game with History / Time-Travel
 * ==============================================================================================
 */

import React, { useState } from 'react';

// ============================================================================
// 1. BASIC COUNTER WITH FUNCTIONAL STATE UPDATER
// ============================================================================
export function InteractiveCounter() {
  const [count, setCount] = useState(0);

  // Safe functional update to avoid race conditions
  const handleIncrement = () => setCount(prev => prev + 1);
  const handleDecrement = () => setCount(prev => Math.max(0, prev - 1));
  const handleReset = () => setCount(0);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #3f3f46', borderRadius: '12px', background: '#18181b', color: '#f4f4f5' }}>
      <h3>Interactive Counter (useState)</h3>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Current Count: {count}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={handleIncrement} style={{ padding: '0.5rem 1rem', background: '#f59e0b', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Increment</button>
        <button onClick={handleDecrement} style={{ padding: '0.5rem 1rem', background: '#3f3f46', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>- Decrement</button>
        <button onClick={handleReset} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Reset</button>
      </div>
    </div>
  );
}

// ============================================================================
// 2. IMMUTABLE STATE MANAGEMENT (ARRAYS & OBJECTS)
// ============================================================================
export function TaskListManager() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Study React Component State', completed: true },
    { id: 2, text: 'Build Tic-Tac-Toe Game with History', completed: false }
  ]);
  const [inputVal, setInputVal] = useState('');

  // Add Item immutably via Spread (...)
  const addTask = () => {
    if (!inputVal.trim()) return;
    const newTask = { id: Date.now(), text: inputVal.trim(), completed: false };
    setTasks(prev => [...prev, newTask]); // Never tasks.push()!
    setInputVal('');
  };

  // Toggle Item immutably via .map()
  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Delete Item immutably via .filter()
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: '1.5rem', marginTop: '1rem', border: '1px solid #3f3f46', borderRadius: '12px', background: '#18181b', color: '#f4f4f5' }}>
      <h3>Immutable Task Manager</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input 
          type="text" 
          value={inputVal} 
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter new task..."
          style={{ flex: 1, padding: '0.5rem', background: '#27272a', border: '1px solid #52525b', color: '#fff', borderRadius: '6px' }}
        />
        <button onClick={addTask} style={{ padding: '0.5rem 1rem', background: '#f59e0b', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Task</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #27272a' }}>
            <span 
              onClick={() => toggleTask(task.id)}
              style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#71717a' : '#f4f4f5', cursor: 'pointer' }}
            >
              {task.completed ? '✔ ' : '⏳ '} {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✖ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// 3. COMPLETE MODULAR TIC-TAC-TOE GAME WITH HISTORY / TIME-TRAVEL
// ============================================================================

// [Child Component 1: Individual Square]
function Square({ value, onSquareClick }) {
  return (
    <button 
      onClick={onSquareClick}
      style={{
        width: '70px',
        height: '70px',
        fontSize: '1.75rem',
        fontWeight: 'bold',
        background: '#27272a',
        border: '1px solid #52525b',
        color: value === 'X' ? '#f59e0b' : '#38bdf8',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'background 0.2s'
      }}
    >
      {value}
    </button>
  );
}

// [Child Component 2: 3x3 Board Container]
function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  let status;
  if (winner) {
    status = `Winner: ${winner} 🏆`;
  } else if (isDraw) {
    status = 'Game Ended in a Draw 🤝';
  } else {
    status = `Next Player: ${xIsNext ? 'X' : 'O'}`;
  }

  function handleClick(i) {
    // If square already filled or game won, ignore click
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // Immutable array shallow copy
    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.2rem', color: winner ? '#f59e0b' : '#f4f4f5' }}>
        {status}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 70px)', gap: '8px' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  );
}

// [Root Controller: Game with Time-Travel History]
export default function TicTacToeGame() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    // Slice history up to currentMove (erasing future if branching from past)
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem', background: '#121214', color: '#f4f4f5', borderRadius: '16px', border: '1px solid #2a2a32' }}>
      <div>
        <h2 style={{ color: '#f59e0b', marginBottom: '1rem' }}>Tic-Tac-Toe PRO (React State)</h2>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div style={{ borderLeft: '1px solid #2a2a32', paddingLeft: '1.5rem' }}>
        <h3>Move History (Time-Travel)</h3>
        <ol style={{ paddingLeft: '1.2rem', maxHeight: '250px', overflowY: 'auto' }}>
          {history.map((_, move) => {
            const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
            const isCurrent = move === currentMove;

            return (
              <li key={move} style={{ marginBottom: '0.4rem' }}>
                <button 
                  onClick={() => jumpTo(move)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.85rem',
                    background: isCurrent ? '#f59e0b' : '#27272a',
                    color: isCurrent ? '#000' : '#f4f4f5',
                    border: '1px solid #3f3f46',
                    borderRadius: '4px',
                    fontWeight: isCurrent ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {description} {isCurrent && '📍'}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

// [Helper: Calculate Winner Lines]
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
