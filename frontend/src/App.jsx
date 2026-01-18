import { useState, useEffect } from "react";

// Use env var for API URL, default to localhost for local dev
// When in K8s, we'll need to configure this to point to the backend service or ingress
const API_URL = import.meta.env.VITE_API_URL || "http://192.168.49.2:30000";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/todos`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(`Error: ${err.message}. Target: ${API_URL}/todos`);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo }),
      });
      const data = await res.json();
      setTodos([data, ...todos]); // Prepend new todo
      setNewTodo("");
    } catch (err) {
      setError("Failed to add todo");
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (res.ok) {
        setTodos(
          todos.map((t) => (t.id === id ? { ...t, completed: !completed } : t)),
        );
      }
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTodos(todos.filter((t) => t.id !== id));
      }
    } catch (err) {
      setError("Failed to delete todo");
    }
  };

  return (
    <div>
      <h1>UAS DevOps Todo</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={addTodo} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <span
              onClick={() => toggleTodo(todo.id, todo.completed)}
              style={{ cursor: "pointer", flex: 1, textAlign: "left" }}
            >
              {todo.title}
            </span>
            <div className="actions">
              <button
                onClick={() => toggleTodo(todo.id, todo.completed)}
                style={{ fontSize: "0.8rem", padding: "0.4rem" }}
              >
                {todo.completed ? "Undo" : "Done"}
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  fontSize: "0.8rem",
                  padding: "0.4rem",
                  backgroundColor: "#d32f2f",
                }}
              >
                Del
              </button>
            </div>
          </li>
        ))}
        {todos.length === 0 && <p>No tasks yet!</p>}
      </ul>
    </div>
  );
}

export default App;
