# ⚛️ Week 2 — Day 03: React Side Effects, `useEffect` Hook & Custom Hooks

**Curriculum Track:** 1-Month Web Development Training  
**Date:** Wednesday, August 12, 2026  
**Topic:** Asynchronous Side Effects, Lifecycle Synchronization, Cleanup Functions & Custom Hooks  

---

## 📚 Table of Contents
1. [Understanding Side Effects in React](#1-understanding-side-effects-in-react)
2. [The `useEffect` Hook Structure](#2-the-useeffect-hook-structure)
3. [Understanding the Dependency Array](#3-understanding-the-dependency-array)
4. [Component Cleanup (Memory Leak Prevention)](#4-component-cleanup-memory-leak-prevention)
5. [Custom Data-Fetching Hooks (`useFetch`)](#5-custom-data-fetching-hooks-usefetch)

---

## 1. Understanding Side Effects in React

A **Side Effect** is any operation that affects something outside the scope of the function currently executing. In React, rendering should be a pure calculation. Any operation that touches external systems must be handled as a side effect.

### Examples of Side Effects:
* Fetching data from a REST API over the network.
* Manually changing the browser DOM (e.g. `document.title = ...`).
* Setting up subscription listeners or WebSockets.
* Scheduling timers (`setTimeout`, `setInterval`).

---

## 2. The `useEffect` Hook Structure

The `useEffect` Hook tells React that your component needs to do something after rendering. React will remember the function you passed and call it after performing the DOM updates.

```javascript
import { useEffect } from 'react';

useEffect(() => {
  // Side Effect code goes here
}, [dependencies]);
```

---

## 3. Understanding the Dependency Array

The second argument to `useEffect` controls when the effect function executes.

| Dependency Array | Execution Frequency | Core Use-Case |
| :--- | :--- | :--- |
| **No Array** | Runs on **every single render** (mount & updates). | ⚠️ Avoid for expensive actions/API fetches (causes infinite loops!). |
| **Empty Array `[]`** | Runs **only once** when component mounts. | Initial API data loading, setting up global listeners. |
| **With State/Props `[count]`**| Runs on mount, and **whenever `count` changes**. | Triggering search fetches when search query changes. |

---

## 4. Component Cleanup (Memory Leak Prevention)

If your effect sets up an ongoing operation (like a timer or subscription), you must clean it up when the component unmounts or before the effect runs again.

To do this, return a **cleanup function** from your effect.

```javascript
useEffect(() => {
  const handleScroll = () => console.log(window.scrollY);
  window.addEventListener('scroll', handleScroll);

  // 🧹 Cleanup Function:
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

---

## 5. Custom Data-Fetching Hooks (`useFetch`)

Custom hooks allow you to extract component logic into reusable functions. Custom hooks are standard JavaScript functions whose names **must start with the word `use`** and can call other Hooks.

### Reusable `useFetch` Hook:
```javascript
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not OK");
        const json = await res.json();
        if (active) setData(json);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();

    // Cleanup to prevent setting state on unmounted component
    return () => {
      active = false;
    };
  }, [url]);

  return { data, loading, error };
}
```
