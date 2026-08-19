# 🌐 Next.js Foundations, App Router & Server Components

**Curriculum Track:** 1-Month Web Development Training  
**Date:** Sunday, August 16, 2026  
**Topic:** Next.js App Router, React Server Components vs Client Components, Rendering Strategies & API Routes  

---

## 📚 Table of Contents
1. [What is Next.js & Why Use It?](#1-what-is-nextjs--why-use-it)
2. [App Router Architecture & File Conventions](#2-app-router-architecture--file-conventions)
3. [Server Components vs Client Components](#3-server-components-vs-client-components)
4. [Rendering Strategies: SSR vs SSG vs ISR](#4-rendering-strategies-ssr-vs-ssg-vs-isr)
5. [Next.js Route Handlers (`app/api/route.js`)](#5-nextjs-route-handlers-appapiroutejs)

---

## 1. What is Next.js & Why Use It?

Next.js is a full-stack production React framework created by Vercel.

### Key Benefits:
* **Hybrid Rendering**: Built-in Server-Side Rendering (SSR) and Static Site Generation (SSG).
* **SEO Optimization**: Automatic HTML pre-rendering so search engine crawlers index your content.
* **Built-in Routing**: File-system based routing inside the `app/` folder.
* **Automatic Performance**: Built-in image (`next/image`), font (`next/font`), and script optimizations.

---

## 2. App Router Architecture & File Conventions

Inside the `app/` directory, nested folders define URL routes:

```
app/
├── layout.jsx      ➔ Root Layout (wraps all pages)
├── page.jsx        ➔ Home Page (/)
├── about/
│   └── page.jsx    ➔ About Page (/about)
├── api/
│   └── users/
│       └── route.js ➔ REST API Endpoint (/api/users)
├── loading.jsx     ➔ Fallback UI during page loads
└── error.jsx       ➔ Error boundary UI
```

---

## 3. Server Components vs Client Components

| Feature | Server Components (Default) | Client Components (`'use client'`) |
| :--- | :--- | :--- |
| **Execution** | Runs **only on the server**. | Runs on server (pre-render) & hydrated on **client**. |
| **Bundle Size** | Zero JS added to client bundle. | Adds JS to browser bundle. |
| **Hooks Usage** | ❌ Cannot use `useState`, `useEffect`. | ✅ Can use `useState`, `useEffect`, `useRef`. |
| **Event Handlers** | ❌ Cannot use `onClick`, `onChange`. | ✅ Can use `onClick`, `onChange`. |
| **Use Case** | Fetching data, accessing backend DBs. | User interactivity, form inputs, event listeners. |

---

## 4. Rendering Strategies: SSR vs SSG vs ISR

* **SSR (Server-Side Rendering)**: Pre-renders HTML on **every single HTTP request**. Ideal for dynamic data (e.g. user feeds, live search).
* **SSG (Static Site Generation)**: Pre-renders HTML **once at build time**. Ideal for static pages (blogs, documentation, marketing pages).
* **ISR (Incremental Static Regeneration)**: Updates static pages in the background after a specified revalidation time interval without re-building the whole site.

---

## 5. Next.js Route Handlers (`app/api/route.js`)

Route Handlers allow creating custom HTTP endpoints using Web `Request` and `Response` APIs:

```javascript
import { NextResponse } from 'next/server';

export async function GET() {
  const data = { message: "Welcome to Next.js API Route!" };
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ received: body }, { status: 201 });
}
```
