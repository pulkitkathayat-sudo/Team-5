import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineTrash,
  HiOutlineBadgeCheck,
} from 'react-icons/hi';

const ROLE_COLORS = {
  EMPLOYEE: '#3b82f6',
  MANAGER: '#8b5cf6',
  ADMIN: '#ef4444',
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const handleAvailabilityChange = async (userId, status) => {
    try {
      await api.put(`/admin/users/${userId}/availability?status=${status}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to update availability', err);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Delete user "${userName}"? This action cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const filteredUsers =
    filterRole === 'ALL' ? users : users.filter((u) => u.role === filterRole);

  const stats = {
    total: users.length,
    employees: users.filter((u) => u.role === 'EMPLOYEE').length,
    managers: users.filter((u) => u.role === 'MANAGER').length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>User Administration</h1>
          <p>Manage users, roles, and access control</p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat" onClick={() => setFilterRole('ALL')}>
          <HiOutlineUsers className="admin-stat-icon" />
          <span className="admin-stat-value">{stats.total}</span>
          <span className="admin-stat-label">Total Users</span>
        </div>
        <div className="admin-stat" onClick={() => setFilterRole('EMPLOYEE')}>
          <span className="admin-stat-dot" style={{ background: ROLE_COLORS.EMPLOYEE }}></span>
          <span className="admin-stat-value">{stats.employees}</span>
          <span className="admin-stat-label">Employees</span>
        </div>
        <div className="admin-stat" onClick={() => setFilterRole('MANAGER')}>
          <span className="admin-stat-dot" style={{ background: ROLE_COLORS.MANAGER }}></span>
          <span className="admin-stat-value">{stats.managers}</span>
          <span className="admin-stat-label">Managers</span>
        </div>
        <div className="admin-stat" onClick={() => setFilterRole('ADMIN')}>
          <span className="admin-stat-dot" style={{ background: ROLE_COLORS.ADMIN }}></span>
          <span className="admin-stat-value">{stats.admins}</span>
          <span className="admin-stat-label">Admins</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="admin-filter-bar">
        <span className="filter-label">Showing: </span>
        {['ALL', 'EMPLOYEE', 'MANAGER', 'ADMIN'].map((role) => (
          <button
            key={role}
            className={`category-tab ${filterRole === role ? 'active' : ''}`}
            onClick={() => setFilterRole(role)}
          >
            {role === 'ALL' ? 'All' : role.charAt(0) + role.slice(1).toLowerCase() + 's'}
          </button>
        ))}
      </div>

      {/* User Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="table-user">
                    <div
                      className="table-avatar"
                      style={{ background: ROLE_COLORS[user.role] }}
                    >
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <span className="table-name">{user.name}</span>
                      <span className="table-designation">{user.designation || '—'}</span>
                    </div>
                  </div>
                </td>
                <td className="table-email">{user.email}</td>
                <td>{user.department || '—'}</td>
                <td>
                  <select
                    className="role-select"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{ color: ROLE_COLORS[user.role] }}
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td>
                  <select
                    className="status-select"
                    value={user.availabilityStatus}
                    onChange={(e) => handleAvailabilityChange(user.id, e.target.value)}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_PROJECT">On Project</option>
                    <option value="ON_BENCH">On Bench</option>
                  </select>
                </td>
                <td>
                  <button
                    className="icon-btn danger"
                    onClick={() => handleDelete(user.id, user.name)}
                    title="Delete user"
                  >
                    <HiOutlineTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
