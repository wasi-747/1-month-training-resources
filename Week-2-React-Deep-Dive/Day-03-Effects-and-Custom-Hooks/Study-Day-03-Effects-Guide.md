# 📖 Day 03 Study Guide: React Side Effects, `useEffect` Hook & Custom Hooks

**Curriculum Track:** 1-Month Web Development Training (Week 2, Day 03 Study Reference)  
**Author:** Full-Stack Engineering Trainee  

---

## 📚 Table of Contents
1. [React Side Effects ki?](#1-react-side-effects-ki)
2. [`useEffect` Hook Structure & Triggering](#2-useeffect-hook-structure--triggering)
3. [Dependency Array rules: Empty vs With Variables](#3-dependency-array-rules-empty-vs-with-variables)
4. [Component Cleanup: Memory Leak Prevention](#4-component-cleanup-memory-leak-prevention)
5. [Custom Hooks for Reusable Logic](#5-custom-hooks-for-reusable-logic)

---

## 1. React Side Effects ki?

React Component-er core render function hocche **Pure Calculation** — exact same props/state input dile output-o exact same component structure render hobe.

Kintu, amader jodi component-er baire external systems-er shaathe interact korte hoy, shetake **Side Effect** bola hoy.

### Common Examples of Side Effects:
* **API Calls:** Backend server theke data fetch kora.
* **Direct DOM Mutations:** Component-er baire thaka page-er `document.title = "Profile"` change kora.
* **Timers:** `setTimeout` ba `setInterval` initiate kora.
* **Subscriptions:** WebSockets ba event listeners window-te bind kora.

React-e ei side effects gulo safely handle korar jonno amra **`useEffect` Hook** use kori.

---

## 2. `useEffect` Hook Structure & Triggering

`useEffect` browser layout paint hoyar por asynchronously execute hoy, jar fole browser block hoy na.

### Syntax:
```javascript
import { useEffect } from 'react';

useEffect(() => {
  // side effect code goes here
}, [dependencies]);
```

---

## 3. Dependency Array rules: Empty vs With Variables

`useEffect`-er exact trigger execution frequency depend kore target **Dependency Array** (2nd argument)-er opor:

### 📋 Dependency Array Comparison:

| Option | Syntax | Execution Trigger | Use-Case |
| :--- | :--- | :--- | :--- |
| **No Array** | `useEffect(() => { ... })` | **Every single render** (mount and updates). | ⚠️ **Avoid!** API fetch-e infinite render loops create kore. |
| **Empty Array** | `useEffect(() => { ... }, [])` | **Only once on mount** (when component first loads). | Initial API data loading. |
| **With State/Props**| `useEffect(() => { ... }, [query])` | On mount, and **whenever `query` changes**. | Live search query inputs sync. |

---

## 4. Component Cleanup: Memory Leak Prevention

Jokhon component unmount hoy (screen theke delete hoy) ba dependency array update hoy, tar ager set up kora interval, timer ba listeners safely clear korte hoy. Eta na korle browser memory full / leak hoy (zombie processes).

### Cleanup Function Pattern:
`useEffect` block theke ekta callback function return korte hoy. React unmount/re-effect run korar age automatic ei function call kore cleanup kore.

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);

  // 🧹 Cleanup function:
  return () => {
    clearInterval(timer); // Memory leak prevention!
  };
}, []);
```

---

## 5. Custom Hooks for Reusable Logic

Re-usable stateful logic (jemon custom API fetching logic) multiple components-e call korte amra **Custom Hook** declare kori.
* Custom hook-er naam **oboshoy `use` shobdo diye shuru hote hobe** (e.g. `useFetch`, `useLocalStorage`).
* Custom hook-er bhitore amra native Hooks (`useState`, `useEffect`) safely use korte pari.

### Reusable `useFetch` Snippet:
```javascript
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setLoading(true);
      const res = await fetch(url);
      const json = await res.json();
      if (isCurrent) setData(json);
      setLoading(false);
    }

    load();

    return () => {
      isCurrent = false; // Prevents updating state on unmounted components
    };
  }, [url]);

  return { data, loading };
}
```
