import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const BASE_URL = "https://task-manager-backend-lmaf.onrender.com";

  // AUTH
  const signup = async () => {
    await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });
    alert("Signup successful! Now login.");
  };

  const login = async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      alert("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // TASKS
  const fetchTasks = async (userId) => {
    const res = await fetch(`${BASE_URL}/tasks?userId=${userId}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      fetchTasks(u._id);
    }
  }, []);

  const addTask = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ title, description, userId: user._id })
    });

    setTitle("");
    setDescription("");
    fetchTasks(user._id);
  };

  const deleteTask = async (id) => {
    await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
    fetchTasks(user._id);
  };

  const toggleStatus = async (task) => {
    await fetch(`${BASE_URL}/tasks/${task._id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        ...task,
        status: task.status === "pending" ? "completed" : "pending"
      })
    });
    fetchTasks(user._id);
  };

  // LOGIN UI
  if (!user) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2, #6b8cff)"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.95)",
          padding: "30px",
          borderRadius: "12px",
          width: "300px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)"
        }}>
          <h2 style={{ marginBottom: "15px" }}>Login</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          <button onClick={login} style={btnPrimary}>Login</button>

          <button 
            onClick={signup} 
            style={{ ...btnSecondary, marginTop: "10px", width: "100%" }}
          >
            Signup
          </button>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f8",
      padding: "20px"
    }}>
      <div style={{ maxWidth: "650px", margin: "auto" }}>
        
        {/* HEADER */}
        <div style={{ position: "relative", marginBottom: "25px" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>
              Task Manager Dashboard
            </h1>

            <p style={{
              marginTop: "6px",
              fontSize: "15px",
              color: "#666"
            }}>
              Logged in as {user.email}
            </p>
          </div>

          <button 
            onClick={logout} 
            style={{
              ...btnSecondary,
              position: "absolute",
              right: 0,
              top: 0,
              padding: "6px 12px",
              fontSize: "14px"
            }}
          >
            Logout
          </button>
        </div>

        {/* ADD TASK */}
        <div style={card}>
          <h3 style={{ marginBottom: "10px" }}>Add Task</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={input}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={input}
          />

          <button onClick={addTask} style={btnPrimary}>Add Task</button>
        </div>

        {tasks.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
            No tasks yet 🚀
          </p>
        )}

        {/* TASK LIST */}
        {tasks.map((task) => (
          <div key={task._id} style={card}>
            <h3 style={{ marginBottom: "5px" }}>{task.title}</h3>

            <p style={{ color: "#555", marginBottom: "10px" }}>
              {task.description}
            </p>

            <p style={{ marginBottom: "12px" }}>
              Status:{" "}
              <span style={{
                color: task.status === "completed" ? "#2ecc71" : "#f39c12",
                fontWeight: "600"
              }}>
                {task.status}
              </span>
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={() => deleteTask(task._id)} 
                style={btnDanger}
              >
                Delete
              </button>

              <button
                onClick={() => toggleStatus(task)}
                style={{
                  ...btnPrimary,
                  background: task.status === "completed" ? "#f39c12" : "#2ecc71"
                }}
              >
                {task.status === "pending" ? "Complete" : "Undo"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// STYLES
const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  outline: "none"
};

const card = {
  background: "white",
  padding: "18px",
  marginTop: "18px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const btnPrimary = {
  flex: 1,
  padding: "10px",
  background: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnSecondary = {
  padding: "8px 12px",
  background: "#444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnDanger = {
  flex: 1,
  padding: "10px",
  background: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default App;