import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, skillAPI } from '../api/axios';
import { Link } from 'react-router-dom';
import {
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineLightningBolt,
  HiOutlineClipboardCheck,
  HiOutlineChartBar,
  HiOutlineTrendingUp,
  HiOutlinePlus,
} from 'react-icons/hi';

const Dashboard = () => {
  const { user, isAdmin, isManager, isEmployee } = useAuth();
  const [stats, setStats] = useState(null);
  const [mySkillCount, setMySkillCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, skillsRes] = await Promise.all([
        dashboardAPI.getStats(),
        isEmployee ? skillAPI.getMySkills() : Promise.resolve({ data: [] }),
      ]);
      setStats(statsRes.data);
      setMySkillCount(skillsRes.data.length);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>
            {getGreeting()}, <span className="highlight">{user?.name}</span>
          </h1>
          <p className="dashboard-subtitle">
            {isAdmin && "Here's your organization overview"}
            {isManager && 'Manage your team and projects'}
            {isEmployee && "Here's your profile summary"}
          </p>
        </div>
        <div className="role-badge-large">{user?.role}</div>
      </div>

      <div className="stats-grid">
        {isEmployee && (
          <>
            <div className="stat-card gradient-blue">
              <div className="stat-icon"><HiOutlineLightningBolt /></div>
              <div className="stat-info">
                <span className="stat-value">{mySkillCount}</span>
                <span className="stat-label">Skills Added</span>
              </div>
            </div>
            <div className="stat-card gradient-purple">
              <div className="stat-icon"><HiOutlineClipboardCheck /></div>
              <div className="stat-info">
                <span className="stat-value">0</span>
                <span className="stat-label">Certifications</span>
              </div>
            </div>
            <div className="stat-card gradient-teal">
              <div className="stat-icon"><HiOutlineBriefcase /></div>
              <div className="stat-info">
                <span className="stat-value">Available</span>
                <span className="stat-label">Current Status</span>
              </div>
            </div>
            <div className="stat-card gradient-orange">
              <div className="stat-icon"><HiOutlineChartBar /></div>
              <div className="stat-info">
                <span className="stat-value">{stats?.totalEmployees || 0}</span>
                <span className="stat-label">Org Employees</span>
              </div>
            </div>
          </>
        )}

        {(isManager || isAdmin) && (
          <>
            <div className="stat-card gradient-blue">
              <div className="stat-icon"><HiOutlineUsers /></div>
              <div className="stat-info">
                <span className="stat-value">{stats?.totalEmployees || 0}</span>
                <span className="stat-label">Total Employees</span>
              </div>
            </div>
            <div className="stat-card gradient-purple">
              <div className="stat-icon"><HiOutlineBriefcase /></div>
              <div className="stat-info">
                <span className="stat-value">{stats?.activeProjects || 0}</span>
                <span className="stat-label">Active Projects</span>
              </div>
            </div>
            <div className="stat-card gradient-teal">
              <div className="stat-icon"><HiOutlineTrendingUp /></div>
              <div className="stat-info">
                <span className="stat-value">{stats?.availableEmployees || 0}</span>
                <span className="stat-label">Available Talent</span>
              </div>
            </div>
            <div className="stat-card gradient-orange">
              <div className="stat-icon"><HiOutlineChartBar /></div>
              <div className="stat-info">
                <span className="stat-value">{stats?.utilizationRate || 0}%</span>
                <span className="stat-label">Utilization Rate</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            {isEmployee && (
              <>
                <Link to="/skills" className="action-btn">
                  <HiOutlineLightningBolt /> Manage Skills
                </Link>
                <Link to="/profile" className="action-btn">
                  <HiOutlineUsers /> Update Profile
                </Link>
              </>
            )}
            {(isManager || isAdmin) && (
              <>
                <Link to="/search" className="action-btn">
                  <HiOutlineUsers /> Search Employees
                </Link>
                <Link to="/projects" className="action-btn">
                  <HiOutlineBriefcase /> View Projects
                </Link>
              </>
            )}
          </div>
        </div>

        {(isManager || isAdmin) && stats?.skillDistribution && Object.keys(stats.skillDistribution).length > 0 && (
          <div className="dashboard-card">
            <h3>Top Skills in Organization</h3>
            <div className="skill-distribution">
              {Object.entries(stats.skillDistribution).map(([name, count]) => (
                <div key={name} className="skill-bar-item">
                  <div className="skill-bar-header">
                    <span className="skill-bar-name">{name}</span>
                    <span className="skill-bar-count">{count}</span>
                  </div>
                  <div className="skill-bar-track">
                    <div
                      className="skill-bar-fill"
                      style={{
                        width: `${(count / Math.max(...Object.values(stats.skillDistribution))) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isEmployee && (
          <div className="dashboard-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-empty">
                <p>No recent activity yet</p>
                <span>Your activity will appear here</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
