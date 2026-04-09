import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/axios';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineBadgeCheck,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userAPI.getProfile();
      setProfile(res.data);
      setEditData({
        name: res.data.name || '',
        phone: res.data.phone || '',
        designation: res.data.designation || '',
        department: res.data.department || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(editData);
      setProfile(res.data);
      setEditing(false);
      // Update localStorage user name if changed
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (editData.name && editData.name !== storedUser.name) {
        storedUser.name = editData.name;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  const getCompleteness = () => {
    if (!profile) return 0;
    let filled = 0;
    const fields = ['name', 'email', 'phone', 'designation', 'department'];
    fields.forEach((f) => {
      if (profile[f] && profile[f].trim() !== '') filled++;
    });
    return Math.round((filled / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const completeness = getCompleteness();

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and settings</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card profile-summary">
          <div className="profile-avatar-large">
            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2>{profile?.name}</h2>
          <span className="role-badge">{profile?.role}</span>
          <p className="profile-email">{profile?.email}</p>

          <div className="status-badge-container">
            <span className={`status-badge status-${profile?.availabilityStatus?.toLowerCase()}`}>
              <HiOutlineBadgeCheck /> {profile?.availabilityStatus?.replace('_', ' ')}
            </span>
          </div>

          <div className="profile-completeness">
            <div className="completeness-header">
              <span>Profile Completeness</span>
              <span>{completeness}%</span>
            </div>
            <div className="completeness-bar">
              <div className="completeness-fill" style={{ width: `${completeness}%` }}></div>
            </div>
          </div>
        </div>

        <div className="profile-card profile-details">
          <div className="card-header">
            <h3>Personal Information</h3>
            {!editing ? (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                <HiOutlinePencil /> Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave} disabled={saving}>
                  <HiOutlineCheck /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button className="cancel-btn" onClick={() => setEditing(false)}>
                  <HiOutlineX /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <HiOutlineUser className="detail-icon" />
              <div>
                <label>Full Name</label>
                {editing ? (
                  <input name="name" value={editData.name} onChange={handleChange} />
                ) : (
                  <span>{profile?.name}</span>
                )}
              </div>
            </div>

            <div className="detail-item">
              <HiOutlineMail className="detail-icon" />
              <div>
                <label>Email</label>
                <span>{profile?.email}</span>
              </div>
            </div>

            <div className="detail-item">
              <HiOutlinePhone className="detail-icon" />
              <div>
                <label>Phone</label>
                {editing ? (
                  <input name="phone" value={editData.phone} onChange={handleChange} placeholder="Add phone number" />
                ) : (
                  <span>{profile?.phone || 'Not provided'}</span>
                )}
              </div>
            </div>

            <div className="detail-item">
              <HiOutlineBriefcase className="detail-icon" />
              <div>
                <label>Designation</label>
                {editing ? (
                  <input name="designation" value={editData.designation} onChange={handleChange} placeholder="Add designation" />
                ) : (
                  <span>{profile?.designation || 'Not provided'}</span>
                )}
              </div>
            </div>

            <div className="detail-item">
              <HiOutlineOfficeBuilding className="detail-icon" />
              <div>
                <label>Department</label>
                {editing ? (
                  <input name="department" value={editData.department} onChange={handleChange} placeholder="Add department" />
                ) : (
                  <span>{profile?.department || 'Not provided'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <div className="card-header">
            <h3>My Skills</h3>
            <Link to="/skills" className="edit-btn">
              Manage Skills →
            </Link>
          </div>
          <div className="skills-empty">
            <p>Go to the Skills page to add and manage your skills</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
