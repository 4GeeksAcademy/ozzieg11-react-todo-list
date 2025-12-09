import React, { useEffect, useState, useRef } from "react";
import "../../styles/index.css";

export default function TodoList() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("todolist:theme");
      if (stored) return stored;
      return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("todolist:theme", theme);
      if (theme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch {}
  }, [theme]);

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
    localStorage.setItem("todos:v1", JSON.stringify(todos));
  }, [todos]);

  function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTodo = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setText("");
    inputRef.current?.focus();
  }

  function removeTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }
  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }
  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }
  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="todo-root">
      <div
        className="todo-card"
        role="application"
        aria-label="Todo list application"
      >
        <header className="todo-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <h1 className="todo-title">Todo List</h1>
              <p className="todo-sub">
                Add tasks, mark complete, and remove items.
              </p>
            </div>

            <div>
              <button
                className="theme-toggle"
                onClick={() =>
                  setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                }
                aria-label="Toggle theme"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </header>

        <form className="todo-form" onSubmit={addTodo} aria-label="Add todo">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="todo-input"
            placeholder="What needs to be done?"
            aria-label="New todo"
          />
          <button type="submit" className="todo-add" disabled={!text.trim()}>
            Add
          </button>
        </form>

        <section className="todo-list-wrap" aria-live="polite">
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
                      aria-label={
                        todo.completed
                          ? `Mark ${todo.text} as not completed`
                          : `Mark ${todo.text} as completed`
                      }
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
                    <time
                      className="todo-time"
                      dateTime={new Date(todo.createdAt).toISOString()}
                    >
                      {new Date(todo.createdAt).toLocaleString()}
                    </time>
                    <button
                      onClick={() => removeTodo(todo.id)}
                      aria-label={`Remove ${todo.text}`}
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
            <button onClick={() => setTodos([])} className="todo-action">
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
