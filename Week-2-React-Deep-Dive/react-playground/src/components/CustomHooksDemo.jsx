import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useToggle } from '../hooks/useToggle';

export function CustomHooksDemo() {
  const [endpoint, setEndpoint] = useState('https://jsonplaceholder.typicode.com/users/1');
  const [showJson, toggleJson] = useToggle(true);
  const { data, loading, error } = useFetch(endpoint);

  return (
    <div className="card custom-hooks-card">
      <h3 className="card-title">⚡ Custom Hooks Live Demo</h3>
      <p className="card-description">
        Testing <code>useFetch</code> for data fetching & <code>useToggle</code> for UI states.
      </p>

      <div style={{ display: 'flex', gap: '10px', margin: '15px 0', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-success"
          onClick={() => setEndpoint('https://jsonplaceholder.typicode.com/users/1')}
        >
          User #1
        </button>
        <button 
          className="btn btn-success"
          onClick={() => setEndpoint('https://jsonplaceholder.typicode.com/users/2')}
        >
          User #2
        </button>
        <button 
          className="btn btn-secondary"
          onClick={toggleJson}
        >
          {showJson ? 'Hide Details 🙈' : 'Show Details 👁️'}
        </button>
      </div>

      {loading && <div className="status-banner">⏳ Fetching data via <code>useFetch</code>...</div>}
      {error && <div className="status-banner" style={{ borderColor: '#ef4444', color: '#ef4444' }}>⚠️ Error: {error}</div>}

      {!loading && !error && data && (
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
          <h4>👤 {data.name} (@{data.username})</h4>
          <p>📧 Email: {data.email}</p>
          <p>🏢 Company: {data.company?.name}</p>

          {showJson && (
            <pre style={{ 
              background: '#0f172a', 
              padding: '10px', 
              borderRadius: '6px', 
              overflowX: 'auto', 
              fontSize: '0.85rem',
              color: '#38bdf8',
              marginTop: '10px' 
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
