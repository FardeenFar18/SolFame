import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import '../App.css';
import { useNavigate } from 'react-router-dom';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function OwnerDashboard() {
  const [revenue, setRevenue] = useState(0);
  const [events, setEvents] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetching mock data
    fetch('/api/revenue')
      .then(response => response.json())
      .then(data => setRevenue(data.totalRevenue));

    fetch('/api/events')
      .then(response => response.json())
      .then(data => setEvents(data));

    fetch('/api/staff')
      .then(response => response.json())
      .then(data => setStaffCount(data.length));

    fetch('/api/inventory')
      .then(response => response.json())
      .then(data => setInventory(data));

  }, []);

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue Growth',
      data: [65, 59, 80, 81, 56, 55],
      fill: false,
      borderColor: '#4bc0c0',
      tension: 0.1,
    }],
  };

  const barChartData = {
    labels: ['Events', 'Staff', 'Inventory'],
    datasets: [{
      label: 'Data Comparison',
      data: [events.length, staffCount, inventory.length],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
  };

  const pieChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [75, 25],
      backgroundColor: ['#36A2EB', '#FFCE56'],
    }],
  };

  const goToEvents = () => {
    navigate('/Event-Management'); // Navigate to Events page
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li onClick={goToEvents} style={{ cursor: "pointer"}}>
          Events
        </li>
            <li>Staff</li>
            <li>Inventory</li>
            <li>Reports</li>
          </ul>
        </nav>
      </div>

      <div className="content">
        <div className="navbar">
          <h1>Welcome, Admin</h1>
          <div className="user-info">
            <p>User: John Doe</p>
            <button>Logout</button>
          </div>
        </div>

        <div className="widgets">
          <div className="widget">
            <h3>Total Revenue</h3>
            <p>${revenue}</p>
          </div>
          <div className="widget">
            <h3>Total Events</h3>
            <p>{events.length}</p>
          </div>
          <div className="widget">
            <h3>Staff Count</h3>
            <p>{staffCount}</p>
          </div>
          <div className="widget">
            <h3>Inventory Items</h3>
            <p>{inventory.length}</p>
          </div>
        </div>

        <div className="charts">
          <div className="chart">
            <h2>Revenue Growth</h2>
            <Line data={lineChartData} />
          </div>
          <div className="chart">
            <h2>Data Comparison</h2>
            <Bar data={barChartData} />
          </div>
          <div className="chart">
            <h2>Task Progress</h2>
            <Pie data={pieChartData} />
          </div>
        </div>

        <div className="table">
          <h2>Event List</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                  <td>{event.date}</td>
                  <td>{event.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
