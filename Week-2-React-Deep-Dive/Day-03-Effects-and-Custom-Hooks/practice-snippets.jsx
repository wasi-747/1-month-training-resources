/**
 * ==============================================================================================
 * ⚛️ Week 2 — Day 03: React Side Effects, useEffect Hook & Custom Hooks
 * ==============================================================================================
 * Practice Snippets:
 * 1. Timer Component with Cleanup (Memory Leak Prevention)
 * 2. Standard API Fetching inside useEffect
 * 3. Reusable Custom Hook (useFetch)
 * 4. Completed Tic-Tac-Toe Game with History / Time-Travel
 * ==============================================================================================
 */

import React, { useState, useEffect } from 'react';

// ============================================================================
// 1. TIMER COMPONENT WITH CLEANUP
// ============================================================================
export function TimerWithCleanup() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    // Set up interval timer
    const intervalId = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // 🧹 Cleanup function: Clears interval when component unmounts or isActive changes
    return () => {
      clearInterval(intervalId);
    };
  }, [isActive]);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #3f3f46', borderRadius: '12px', background: '#18181b', color: '#f4f4f5' }}>
      <h3>Timer with Cleanup (useEffect)</h3>
      <p style={{ fontSize: '1.25rem' }}>Active Time: <strong>{seconds} seconds</strong></p>
      <button 
        onClick={() => setIsActive(!isActive)} 
        style={{ padding: '0.5rem 1rem', background: isActive ? '#ef4444' : '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        {isActive ? 'Pause Timer' : 'Resume Timer'}
      </button>
      <button 
        onClick={() => setSeconds(0)} 
        style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem', background: '#3f3f46', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        Reset
      </button>
    </div>
  );
}

// ============================================================================
// 2. REUSABLE CUSTOM HOOK: useFetch
// ============================================================================
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true; // Flag to prevent setting state on unmounted components

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const result = await res.json();
        if (isCurrent) setData(result);
      } catch (err) {
        if (isCurrent) setError(err.message);
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    loadData();

    // 🧹 Cleanup function: Sets flag to false when url changes or component unmounts
    return () => {
      isCurrent = false;
    };
  }, [url]);

  return { data, loading, error };
}

// ============================================================================
// 3. API DATA FETCH DEMO (USING CUSTOM HOOK)
// ============================================================================
export function GitHubUserSearch() {
  const [username, setUsername] = useState('wasi-747');
  const [query, setQuery] = useState('wasi-747');

  const { data, loading, error } = useFetch(`https://api.github.com/users/${query}`);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) setQuery(username.trim());
  };

  return (
    <div style={{ padding: '1.5rem', marginTop: '1rem', border: '1px solid #3f3f46', borderRadius: '12px', background: '#18181b', color: '#f4f4f5' }}>
      <h3>GitHub Profile (Custom useFetch Hook)</h3>
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub Username"
          style={{ flex: 1, padding: '0.5rem', background: '#27272a', border: '1px solid #52525b', color: '#fff', borderRadius: '6px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#f59e0b', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Search</button>
      </form>

      {loading && <p>Loading user profile...</p>}
      {error && <p style={{ color: '#ef4444' }}>Error: {error}</p>}
      {data && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img src={data.avatar_url} alt={data.login} style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
          <div>
            <h4 style={{ margin: 0 }}>{data.name || data.login}</h4>
            <p style={{ margin: 0, color: '#a1a1aa' }}>@{data.login}</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Public Repos: {data.public_repos} | Followers: {data.followers}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. COMPLETED TIC-TAC-TOE GAME WITH HISTORY / TIME-TRAVEL
// ============================================================================

function Square({ value, onSquareClick }) {
  return (
    <button 
      onClick={onSquareClick}
      style={{
        width: '60px',
        height: '60px',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        background: '#27272a',
        border: '1px solid #52525b',
        color: value === 'X' ? '#f59e0b' : '#38bdf8',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'background 0.2s'
      }}
    >
      {value}
    </button>
  );
}

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
      <div style={{ marginBottom: '0.75rem', fontWeight: 'bold', color: winner ? '#f59e0b' : '#f4f4f5' }}>
        {status}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: '6px' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  );
}

export default function TicTacToeGame() {
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
    <div style={{ display: 'flex', gap: '2rem', padding: '1.5rem', background: '#121214', color: '#f4f4f5', borderRadius: '12px', border: '1px solid #2a2a32', marginTop: '1rem' }}>
      <div>
        <h3 style={{ color: '#f59e0b', margin: '0 0 1rem 0' }}>Tic-Tac-Toe Game (Completed)</h3>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ borderLeft: '1px solid #2a2a32', paddingLeft: '1.5rem' }}>
        <h4>Moves History</h4>
        <ol style={{ paddingLeft: '1rem', maxHeight: '180px', overflowY: 'auto' }}>
          {history.map((_, move) => (
            <li key={move} style={{ marginBottom: '0.35rem' }}>
              <button 
                onClick={() => jumpTo(move)}
                style={{
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.8rem',
                  background: move === currentMove ? '#f59e0b' : '#27272a',
                  color: move === currentMove ? '#000' : '#f4f4f5',
                  border: '1px solid #3f3f46',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {move > 0 ? `Go to move #${move}` : 'Go to game start'}
              </button>
            </li>
          ))}
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
