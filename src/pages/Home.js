import { useEffect, useState } from "react";
// import Login from "../Login"
// import Signup from "../Signup"
// import Dashboard from "../Dashboard"  // (your current kanban UI)
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./home.css";
import API from "../api";

// Lucide Icons
import {
  Search,
  Activity,
  ListTodo,
  User,
  Grid,
  Loader,
  Eye,
  CheckCircle2,
  UserPlus,
  Trash2,
  Pencil,
  MoreVertical,
  LogOut,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterName, setFilterName] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  // Load tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const countTasks = (status) => {
    return tasks.filter((task) => task.status === status).length;
  };

  // Add Task
  const handleAddTask = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Task",
      html:
        '<input id="swal-task-title" class="swal2-input" placeholder="Task Title">' +
        '<input id="swal-task-description" class="swal2-input" placeholder="Description">' +
        '<input id="swal-task-person" class="swal2-input" placeholder="Assigned To">' +
        '<select id="swal-task-priority" class="swal2-select">' +
        '<option value="High">High</option>' +
        '<option value="Medium">Medium</option>' +
        '<option value="Low">Low</option>' +
        "</select>",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add Task",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const title = document.getElementById("swal-task-title").value;
        const description = document.getElementById(
          "swal-task-description"
        ).value;
        const person = document.getElementById("swal-task-person").value;
        const priority = document.getElementById("swal-task-priority").value;

        if (!title || !person) {
          Swal.showValidationMessage("Please enter both title and person");
          return false;
        }
        return { title, description, person, priority };
      },
    });

    if (formValues) {
      try {
        const newTask = {
          title: formValues.title,
          description: formValues.description,
          person: formValues.person,
          photo: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          status: "todo",
          priority: formValues.priority,
        };

        const res = await API.post("/tasks", newTask);
        setTasks((prev) => [...prev, res.data]);

        Swal.fire("Added!", "Task added successfully", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Could not add task", "error");
      }
    }
  };

  // Drag Start
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  // Drop Task
  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    try {
      const task = tasks.find((t) => t._id === taskId || t.id === taskId);
      if (!task) return;

      const updated = { ...task, status: newStatus };
      await API.put(`/tasks/${taskId}`, updated);

      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId || t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Filters
  const filterTasks = (list) => {
    return list.filter(
      (task) =>
        (filterStatus === "all" || task.status === filterStatus) &&
        (filterPriority === "all" ||
          task.priority.toLowerCase() === filterPriority.toLowerCase()) &&
        (filterName.trim() === "" ||
          task.person.toLowerCase().includes(filterName.toLowerCase()))
    );
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) =>
        prev.filter((task) => task._id !== id && task.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Update task
  const handleUpdate = async (id) => {
    const task = tasks.find((t) => t._id === id || t.id === id);
    if (!task) return;

    const { value: newTitle } = await Swal.fire({
      title: "Update Task",
      input: "text",
      inputLabel: "Task Title",
      inputValue: task.title,
      showCancelButton: true,
    });

    if (newTitle) {
      try {
        const updated = { ...task, title: newTitle };
        await API.put(`/tasks/${id}`, updated);
        setTasks((prev) =>
          prev.map((t) =>
            t._id === id || t.id === id ? { ...t, title: newTitle } : t
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="container2">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-inside">
              <div className="logo">
                <Activity  size={28} />
                <h2>TaskFlow</h2>
              </div>
              {/* Welcome Section */}
              <section className="welcome-section">
                <div className="welcome-content">
                  <h2>Welcome back, {user?.name || "User"}! 👋</h2>
                  <p>Here's what's happening with your tasks today.</p>
                </div>
                <a className="add-btn-logout" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Logout</span>
                </a>
              </section>
              <div className="counts">
                <h2>
                  <ListTodo style={{Color:" #0f172a"}} size={18} /> Todo {countTasks("todo")}
                </h2>
                <h2>
                  <Loader style={{Color:" #0f172a"}} size={18} className="animate-spin" /> In Progress{" "}
                  {countTasks("inprogress")}
                </h2>
                <h2>
                  <Eye style={{Color:" #0f172a"}} size={18} /> Under Review {countTasks("underreview")}
                </h2>
                <h2>
                  <CheckCircle2 style={{Color:" #0f172a"}} size={18} /> Done {countTasks("done")}
                </h2>
              </div>
            </div>
            {/* <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button> */}
          </div>

          {/* Board */}
          <div className="board">
            <header className="header">
              {/* <h1>Task Manager</h1> */}

              {/* <div className="counts">
              <h2>
                <ListTodo size={18} /> Todo {countTasks("todo")}
              </h2>
              <h2>
                <Loader size={18} className="animate-spin" /> In Progress{" "}
                {countTasks("inprogress")}
              </h2>
              <h2>
                <Eye size={18} /> Under Review {countTasks("underreview")}
              </h2>
              <h2>
                <CheckCircle2 size={18} /> done {countTasks("done")}
              </h2>
            </div> */}
              <div className="header-content">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Tasks</option>
                  <option value="todo">Todo</option>
                  <option value="inprogress">In Progress</option>
                  <option value="underreview">Under Review</option>
                  <option value="done">Done</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <Search style={{ color: "#0f172a" }} />
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </div>

              <button className="add-btn" onClick={handleAddTask}>
                <UserPlus  size={18} /> Add Task
              </button>
              <button className="add-btn" onClick={() => navigate("/")}>
                <Grid size={18} /> Dashboard
              </button>

              {/* USER INFO */}
              {user && (
                <div className="user-info">
                  <User className="user-img" size={20} />
                  <div>
                    <p className="username">{user.name}</p>
                    <p className="email">{user.email}</p>
                  </div>
                </div>
              )}
            </header>

            {["todo", "inprogress", "underreview", "done"].map((col) => (
              <div
                key={col}
                className="column"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, col)}
              >
                <h2>
                  {col === "todo" ? (
                    <>
                      <ListTodo style={{Color:" #0f172a"}}  size={18} /> Task
                    </>
                  ) : col === "inprogress" ? (
                    <>
                      <Loader style={{Color:" #0f172a"}} size={18} className="animate-spin" /> In Progress
                    </>
                  ) : col === "underreview" ? (
                    <>
                      <Eye style={{Color:" #0f172a"}} size={18} /> Under Review
                    </>
                  ) : (
                    <>
                      <CheckCircle2 style={{Color:" #0f172a"}} size={18} /> Done
                    </>
                  )}
                </h2>

                <div className="tasks">
                  {filterTasks(tasks)
                    .filter((task) => task.status === col)
                    .map((task) => (
                      <div
                        key={task._id || task.id}
                        className="task"
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, task._id || task.id)
                        }
                      >
                        <div className="task-top">
                          <div className="task-actions">
                            {/* Edit */}
                            <button>
                              <Pencil
                                size={16}
                                className="update"
                                onClick={() =>
                                  handleUpdate(task._id || task.id)
                                }
                              />
                            </button>
                            <button>
                              {/* Delete */}
                              <Trash2 
                                size={16} 
                                className="delete"
                                onClick={() =>
                                  handleDelete(task._id || task.id)
                                }
                              />
                            </button>
                            <span
                              className={`priority-s ${task.priority.toLowerCase()}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <h4>{task.title}</h4>
                          <p style={{ color: "black" }}>{task.description}</p>
                        </div>
                        <div className="task-lower-sec">
                          <div className="person-info">
                            <img
                              src={task.photo}
                              alt={task.person}
                              className="person-photo"
                            />
                            <span>{task.person}</span>
                          </div>
                          <div className="date-task">
                            <p className="date-task-inner">
                              {new Date().toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
