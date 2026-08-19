/**
 * 🌐 Next.js Foundations Practice Snippets
 * Topics: App Router Pages, Server Components vs Client Components, Route Handlers
 */

// -------------------------------------------------------------
// 1. Next.js Server Component Example (app/users/page.jsx)
// -------------------------------------------------------------
// Note: Runs on server, fetches data directly without useEffect!
export async function UsersPage() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    cache: 'no-store' // Forces Server-Side Rendering (SSR)
  });
  const users = await response.json();

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>👥 Next.js SSR Users Directory</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> — {user.email}
          </li>
        ))}
      </ul>
    </main>
  );
}

// -------------------------------------------------------------
// 2. Next.js Client Component Example (app/counter/page.jsx)
// -------------------------------------------------------------
// Note: Requires 'use client' directive for interactive hooks
/*
'use client';

import { useState } from 'react';

export default function InteractiveCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Client Counter Component</h2>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
*/

// -------------------------------------------------------------
// 3. Next.js Route Handler Example (app/api/hello/route.js)
// -------------------------------------------------------------
/*
import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({
    status: 'success',
    message: 'Hello from Next.js API Route Handler!',
    timestamp: new Date().toISOString()
  });
}
*/
