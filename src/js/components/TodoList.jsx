import React, { useEffect, useState, useRef } from "react";
import "../../styles/index.css";

const API_URL = "https://playground.4geeks.com/todo/todos/ozzie";

function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 8);
}

export default function TodoList() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("todolist:theme");
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem("todos:v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("todolist:theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    } catch {}
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("todos:v1", JSON.stringify(todos));
  }, [todos]);

  function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: text.trim(), is_done: false }),
    })
      .then(() => {
        const newTodo = {
          id: generateId(),
          text: text.trim(),
          completed: false,
          createdAt: Date.now(),
        };
        setTodos([newTodo, ...todos]);
        setText("");
        inputRef.current?.focus();
      })
      .catch((err) => console.error(err));
  }

  function toggleTodo(id) {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
  }

  function removeTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    const updated = todos.filter((t) => !t.completed);
    setTodos(updated);
  }

  function clearAll() {
    setTodos([]);
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="todo-root">
      <div className="todo-card" role="application">
        <header className="todo-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <h1 className="todo-title">Todo List</h1>
              <p className="todo-sub">
                Add tasks, mark complete, and remove items.
              </p>
            </div>
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="todo-input"
            placeholder="What needs to be done?"
          />
          <button type="submit" className="todo-add" disabled={!text.trim()}>
            Add
          </button>
        </form>

        <section className="todo-list-wrap">
          {todos.length === 0 ? (
            <div className="todo-empty">No tasks, add a task</div>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  <label className="todo-item-left">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    <span
                      onDoubleClick={() => toggleTodo(todo.id)}
                      className={`todo-text ${
                        todo.completed ? "completed" : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                  </label>
                  <div className="todo-item-right">
                    <time className="todo-time">
                      {new Date(todo.createdAt).toLocaleString()}
                    </time>
                    <button
                      onClick={() => removeTodo(todo.id)}
                      className="todo-remove"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="todo-footer">
          <div className="todo-remaining">
            {remaining} item{remaining !== 1 ? "s" : ""} left
          </div>
          <div className="todo-actions">
            <button onClick={clearAll} className="todo-action">
              Clear All
            </button>
            <button onClick={clearCompleted} className="todo-action">
              Clear Completed
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
