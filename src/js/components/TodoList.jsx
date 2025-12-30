import React, { useEffect, useRef, useState } from "react";
import "../../styles/index.css";

const BASE_URL = "https://playground.4geeks.com/todo";
const USERNAME = "ozzie";

export default function TodoList() {
  const [theme, setTheme] = useState("dark");
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const createUser = async () => {
    await fetch(`${BASE_URL}/users/${USERNAME}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        await fetch(`${BASE_URL}/users/${USERNAME}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
      } catch {}
    };
    init();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch(`${BASE_URL}/todos/${USERNAME}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: text, is_done: false }),
    });

    const data = await res.json();
    setTodos([...todos, { ...data }]);
    setText("");
    inputRef.current.focus();
  };

  const removeTodo = async (id) => {
    await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t.id !== id));
  };

  const toggleTodo = async (id) => {
    const todoToUpdate = todos.find((t) => t.id === id);
    if (!todoToUpdate) return;

    const updatedTodo = { ...todoToUpdate, is_done: !todoToUpdate.is_done };

    await fetch(`${BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });

    setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
  };

  const clearAll = async () => {
    await fetch(`${BASE_URL}/users/${USERNAME}`, { method: "DELETE" });
    await createUser();
    setTodos([]);
  };

  const remaining = todos.filter((t) => !t.is_done).length;

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
                      checked={todo.is_done}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    <span
                      className={`todo-text ${todo.is_done ? "completed" : ""}`}
                    >
                      {todo.label}
                    </span>
                  </label>

                  <div className="todo-item-right">
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
          </div>
        </footer>
      </div>
    </div>
  );
}
