import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useRouter } from "next/router";
import { BASE_URL } from "../config/ApiConstant";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // Fetch tasks if token exists
    if (token) {
      axios
        .get(`${BASE_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTasks(res.data))
        .catch((err) => console.error(err));
    }
  }, [token]);

  const addTask = async (task) => {
    try {
      await axios.post(`${BASE_URL}/api/tasks`, task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = await axios.get(`${BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTask = async (id, task) => {
    try {
      await axios.put(`${BASE_URL}/api/tasks/${id}`, task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((t) => (t.id === id ? { ...t, ...task } : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4  mobile:max-w-full">
        Please log in to view tasks. Click on{" "}
        <a href="/login" className="text-blue-500">
          Login
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mobile:max-w-full">
      <div className="flex justify-between items-center mb-4 mobile:flex-col">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-700">
            Welcome, {user.username} ({user.role})
          </span>
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full ml-2 inline-block"
          />
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <TaskForm addTask={addTask} />
      <TaskList
        tasks={tasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
        user={user}
      />
    </div>
  );
}
