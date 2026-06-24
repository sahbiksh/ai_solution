import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { inquiryAPI } from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inquiryAPI
      .getStatistics()
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-spinner"><Spinner animation="border" variant="primary" /></div>;
  }

  if (!stats) {
    return <p className="text-danger">Failed to load dashboard statistics.</p>;
  }

  const monthlyChartData = {
    labels: stats.monthlyTrend.map((m) => m.label),
    datasets: [{
      label: 'Inquiries',
      data: stats.monthlyTrend.map((m) => m.count),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4,
      fill: true,
    }],
  };

  const countryChartData = {
    labels: stats.countryStats.map((c) => c.country),
    datasets: [{
      label: 'Inquiries by Country',
      data: stats.countryStats.map((c) => c.count),
      backgroundColor: ['#2563eb', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    }],
  };

  const serviceChartData = {
    labels: stats.serviceStats.map((s) => s.service),
    datasets: [{
      data: stats.serviceStats.map((s) => s.count),
      backgroundColor: ['#2563eb', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b'],
    }],
  };

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      <Row className="g-3 mb-4">
        {[
          { to: '/admin/inquiries', label: 'Inquiries', icon: '📩', desc: 'View & manage leads' },
          { to: '/admin/testimonials', label: 'Testimonials', icon: '⭐', desc: 'Add, edit, delete reviews' },
          { to: '/admin/blog', label: 'Blog', icon: '📝', desc: 'Manage articles' },
          { to: '/admin/events', label: 'Events', icon: '📅', desc: 'Manage upcoming events' },
          { to: '/admin/gallery', label: 'Gallery', icon: '🖼️', desc: 'Manage photos' },
        ].map((item) => (
          <Col sm={6} lg={4} key={item.to}>
            <Card as={Link} to={item.to} className="card-hover text-decoration-none h-100">
              <Card.Body>
                <div className="fs-3 mb-2">{item.icon}</div>
                <Card.Title className="text-dark">{item.label}</Card.Title>
                <Card.Text className="text-muted small mb-0">{item.desc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        {[
          { label: 'Total Inquiries', value: stats.totalInquiries },
          { label: 'This Month', value: stats.monthlyInquiries },
          { label: 'This Year', value: stats.yearlyInquiries },
          { label: 'Countries', value: stats.countryStats.length },
        ].map((stat) => (
          <Col sm={6} lg={3} key={stat.label}>
            <div className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <div className="stat-card">
            <h5 className="mb-3">Monthly Inquiry Trend</h5>
            <Line data={monthlyChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </Col>
        <Col lg={4}>
          <div className="stat-card">
            <h5 className="mb-3">Service Interest</h5>
            <Doughnut data={serviceChartData} options={{ responsive: true }} />
          </div>
        </Col>
        <Col lg={6}>
          <div className="stat-card">
            <h5 className="mb-3">Inquiries by Country</h5>
            <Bar data={countryChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </Col>
        <Col lg={6}>
          <div className="stat-card">
            <h5 className="mb-3">Status Breakdown</h5>
            <table className="table table-sm">
              <thead>
                <tr><th>Status</th><th>Count</th></tr>
              </thead>
              <tbody>
                {stats.statusStats.map((s) => (
                  <tr key={s.status}>
                    <td className="text-capitalize">{s.status.replace('_', ' ')}</td>
                    <td><strong>{s.count}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
