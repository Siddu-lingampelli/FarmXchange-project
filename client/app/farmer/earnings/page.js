'use client';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function FarmerEarnings() {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    confirmedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    recentOrders: [],
    monthlyEarnings: {},
    totalOrders: 0,
    averageOrderValue: 0
  });

  // Chart Options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          padding: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Hide default legend
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
    cutout: '70%',
    radius: '90%'
  };

  // Chart Data
  const monthlyEarningsData = {
    labels: Object.keys(earnings.monthlyEarnings),
    datasets: [
      {
        label: 'Earnings (₹)',
        data: Object.values(earnings.monthlyEarnings),
        borderColor: '#4299e1',
        backgroundColor: 'rgba(66, 153, 225, 0.5)',
        tension: 0.4
      }
    ]
  };

  const orderStatusData = {
    labels: ['Confirmed', 'Pending', 'Cancelled'],
    datasets: [{
      data: [
        earnings.confirmedOrders,
        earnings.pendingOrders,
        earnings.cancelledOrders
      ],
      backgroundColor: [
        'rgba(72, 187, 120, 0.9)',  // Green for confirmed
        'rgba(236, 201, 75, 0.9)',  // Yellow for pending
        'rgba(245, 101, 101, 0.9)'  // Red for cancelled
      ],
      borderColor: [
        'rgb(72, 187, 120)',
        'rgb(236, 201, 75)',
        'rgb(245, 101, 101)'
      ],
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:3002/api/orders/farmer', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        // Process orders for monthly earnings
        const monthlyEarnings = {};
        const orders = data.orders || [];
        
        orders.forEach(order => {
          if (order.status === 'confirmed') {
            const date = new Date(order.createdAt);
            const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            monthlyEarnings[monthYear] = (monthlyEarnings[monthYear] || 0) + order.totalAmount;
          }
        });

        const totalOrders = orders.length;
        const totalEarnings = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const averageOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;

        setEarnings({
          totalEarnings: data.earnings.totalEarnings,
          confirmedOrders: data.earnings.confirmedOrders,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
          recentOrders: orders.slice(0, 5),
          monthlyEarnings,
          totalOrders,
          averageOrderValue
        });
      }
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Earnings Dashboard</h2>
        </div>
        <a href="/farmer/dashboard" className="nav-link">
          <span className="nav-icon">←</span>
          Back to Dashboard
        </a>
      </nav>

      <div className="earnings-dashboard">
        <div className="earnings-stats">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>Total Earnings</h3>
            <div className="stat-value">₹{earnings.totalEarnings}</div>
            <div className="stat-trend trend-positive">↑ 12.5% vs last month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <h3>Total Orders</h3>
            <div className="stat-value">{earnings.totalOrders}</div>
            <p className="stat-label">{earnings.confirmedOrders} confirmed</p>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <h3>Average Order Value</h3>
            <div className="stat-value">₹{earnings.averageOrderValue}</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card earnings-trend">
            <div className="chart-header">
              <h3>Earnings Overview</h3>
              <div className="chart-filters">
                <button className="time-filter active">Month</button>
                <button className="time-filter">Quarter</button>
                <button className="time-filter">Year</button>
              </div>
            </div>
            <div className="chart-body">
              <Line options={lineOptions} data={monthlyEarningsData} />
            </div>
          </div>

          <div className="chart-card orders-distribution">
            <div className="chart-header">
              <h3>Order Distribution</h3>
            </div>
            <div className="chart-body">
              <div className="pie-chart-container">
                <Pie options={pieOptions} data={orderStatusData} />
                <div className="chart-center-stats">
                  <div className="total-orders">{earnings.totalOrders}</div>
                  <div className="total-label">Total Orders</div>
                </div>
              </div>
            </div>
            <div className="distribution-stats">
              <div className="stat-item">
                <span className="stat-dot" style={{ background: 'rgb(72, 187, 120)' }}></span>
                <span className="stat-label">Confirmed</span>
                <span className="stat-value">{earnings.confirmedOrders}</span>
              </div>
              <div className="stat-item">
                <span className="stat-dot" style={{ background: 'rgb(236, 201, 75)' }}></span>
                <span className="stat-label">Pending</span>
                <span className="stat-value">{earnings.pendingOrders}</span>
              </div>
              <div className="stat-item">
                <span className="stat-dot" style={{ background: 'rgb(245, 101, 101)' }}></span>
                <span className="stat-label">Cancelled</span>
                <span className="stat-value">{earnings.cancelledOrders}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="earnings-table">
          <div className="table-header">
            <div className="table-row">
              <div>Date</div>
              <div>Order Details</div>
              <div>Status</div>
              <div>Customer</div>
              <div>Amount</div>
            </div>
          </div>
          {earnings.recentOrders.map((order) => (
            <div key={order._id} className="table-row">
              <div>{new Date(order.createdAt).toLocaleDateString()}</div>
              <div>Order #{(order._id || '').toString().slice(-8) || 'N/A'}</div>
              <div>
                <span className={`order-status status-${order.status}`}>
                  {order.status}
                </span>
              </div>
              <div>{order.customerName}</div>
              <div className="amount-cell">₹{order.totalAmount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
