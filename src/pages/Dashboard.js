import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { 
  LayoutDashboard, 
  ListTodo, 
  User, 
  LogOut, 
  Menu, 
  X,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const stats = [
    {
      title: "Total Tasks",
      value: "24",
      icon: <ListTodo size={24} />,
      color: "#0969da",
      bg: "#ddf4ff"
    },
    {
      title: "Completed",
      value: "18",
      icon: <CheckCircle2 size={24} />,
      color: "#2da44e",
      bg: "#dafbe1"
    },
    {
      title: "In Progress",
      value: "4",
      icon: <Clock size={24} />,
      color: "#fb8500",
      bg: "#fff5e1"
    },
    {
      title: "Productivity",
      value: "85%",
      icon: <TrendingUp size={24} />,
      color: "#8250df",
      bg: "#fbefff"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Activity size={28} />
            <h2>TaskFlow</h2>
          </div>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active" onClick={() => navigate("/")}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate("/")}>
            <ListTodo size={20} />
            <span>Tasks</span>
          </button>
          <button className="nav-item" onClick={() => navigate("/")}>
            <User size={20} />
            <span>Profile</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1>Dashboard</h1>
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || "User"}</p>
              <p className="user-email">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h2>Welcome back, {user?.name || "User"}! 👋</h2>
            <p>Here's what's happening with your tasks today.</p>
          </div>
          <button className="primary-btn" onClick={() => navigate("/")}>
            <ListTodo size={18} />
            Go to Tasks
          </button>
        </section>

        {/* Stats Grid */}
        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-card" onClick={() => navigate("/")}>
              <ListTodo size={32} />
              <h4>View All Tasks</h4>
              <p>Manage your task board</p>
            </button>
            <button className="action-card" onClick={() => navigate("/")}>
              <CheckCircle2 size={32} />
              <h4>Completed Tasks</h4>
              <p>View finished work</p>
            </button>
            <button className="action-card" onClick={() => navigate("/")}>
              <TrendingUp size={32} />
              <h4>Analytics</h4>
              <p>Track your progress</p>
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon completed">
                <CheckCircle2 size={16} />
              </div>
              <div className="activity-content">
                <p className="activity-text">Completed "Design homepage mockup"</p>
                <p className="activity-time">2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon progress">
                <Clock size={16} />
              </div>
              <div className="activity-content">
                <p className="activity-text">Started working on "API integration"</p>
                <p className="activity-time">4 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon completed">
                <CheckCircle2 size={16} />
              </div>
              <div className="activity-content">
                <p className="activity-text">Completed "Team meeting notes"</p>
                <p className="activity-time">Yesterday</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;