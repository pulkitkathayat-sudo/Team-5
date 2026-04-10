import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectAPI, applicationAPI } from '../api/axios';
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineX,
  HiOutlineOfficeBuilding,
  HiOutlineClipboardCheck,
  HiOutlinePaperAirplane,
} from 'react-icons/hi';

const STATUS_COLORS = {
  PLANNING: '#64748b',
  ACTIVE: '#10b981',
  ON_HOLD: '#f59e0b',
  COMPLETED: '#3b82f6',
  CANCELLED: '#ef4444',
};

const APP_STATUS_COLORS = {
  PENDING: '#f59e0b',
  INTERVIEW_SCHEDULED: '#3b82f6',
  ACCEPTED: '#10b981',
  REJECTED: '#ef4444',
};

const Projects = () => {
  const { isEmployee, isManager, isAdmin } = useAuth();
  const isManagerOrAdmin = isManager || isAdmin;

  const [projects, setProjects] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [applyingProject, setApplyingProject] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [form, setForm] = useState({
    projectName: '',
    clientName: '',
    description: '',
    startDate: '',
    endDate: '',
    requiredHeadcount: 1,
    status: 'PLANNING',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (isManagerOrAdmin) {
        const res = await projectAPI.getAllProjects();
        setProjects(res.data);
      } else {
        const [projRes, appRes] = await Promise.all([
          applicationAPI.getAvailableProjects(),
          applicationAPI.getMyApplications(),
        ]);
        setProjects(projRes.data);
        setMyApplications(appRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStatus = (projectId) => {
    const app = myApplications.find((a) => a.projectId === projectId);
    return app || null;
  };

  // Manager: create/edit project
  const handleSubmit = async () => {
    if (!form.projectName || !form.clientName) {
      setError('Project name and client name are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingProject) {
        await projectAPI.updateProject(editingProject.id, form);
      } else {
        await projectAPI.createProject(form);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project? This will release all allocated employees.')) return;
    try {
      await projectAPI.deleteProject(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  // Employee: apply to project
  const handleApply = async () => {
    setSaving(true);
    setApplyError('');
    try {
      await applicationAPI.apply({
        projectId: applyingProject.id,
        coverNote: coverNote,
      });
      setShowApplyModal(false);
      setCoverNote('');
      setApplyingProject(null);
      fetchData();
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setForm({
      projectName: project.projectName,
      clientName: project.clientName,
      description: project.description || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      requiredHeadcount: project.requiredHeadcount,
      status: project.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setForm({ projectName: '', clientName: '', description: '', startDate: '', endDate: '', requiredHeadcount: 1, status: 'PLANNING' });
    setError('');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <div>
          <h1>{isEmployee ? 'Available Projects' : 'Projects'}</h1>
          <p>{isEmployee ? 'Browse and apply to projects' : 'Manage client projects and team allocations'}</p>
        </div>
        {isManagerOrAdmin && (
          <button className="primary-btn" onClick={() => { resetForm(); setShowModal(true); }}>
            <HiOutlinePlus /> New Project
          </button>
        )}
      </div>

      {/* Employee: My Applications Summary */}
      {isEmployee && myApplications.length > 0 && (
        <div className="my-applications-section">
          <h3 className="section-title">My Applications</h3>
          <div className="applications-summary">
            {myApplications.map((app) => (
              <div key={app.id} className="app-summary-card">
                <div className="app-summary-info">
                  <span className="app-summary-project">{app.projectName}</span>
                  <span className="app-summary-client">{app.clientName}</span>
                </div>
                <span
                  className="app-status-badge"
                  style={{
                    background: `${APP_STATUS_COLORS[app.status]}15`,
                    color: APP_STATUS_COLORS[app.status],
                    borderColor: `${APP_STATUS_COLORS[app.status]}30`,
                  }}
                >
                  {app.status.replace('_', ' ')}
                </span>
                {app.interviewDate && (
                  <span className="app-interview-date">
                    <HiOutlineCalendar /> Interview: {new Date(app.interviewDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{isEmployee ? '🔍' : '📂'}</div>
          <h3>{isEmployee ? 'No projects available' : 'No projects yet'}</h3>
          <p>{isEmployee ? 'Check back later for new opportunities' : 'Create your first project'}</p>
          {isManagerOrAdmin && (
            <button className="primary-btn" onClick={() => { resetForm(); setShowModal(true); }}>
              <HiOutlinePlus /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => {
            const existingApp = isEmployee ? getApplicationStatus(project.id) : null;
            return (
              <div key={project.id} className="project-card">
                <div className="project-card-header">
                  <div>
                    <h3 className="project-name">{project.projectName}</h3>
                    <span className="project-client">
                      <HiOutlineOfficeBuilding /> {project.clientName}
                    </span>
                  </div>
                  {isManagerOrAdmin && (
                    <div className="project-actions">
                      <button className="icon-btn" onClick={() => openEdit(project)} title="Edit">
                        <HiOutlinePencil />
                      </button>
                      <button className="icon-btn danger" onClick={() => handleDelete(project.id)} title="Delete">
                        <HiOutlineTrash />
                      </button>
                    </div>
                  )}
                </div>

                {project.description && <p className="project-desc">{project.description}</p>}

                <div className="project-meta">
                  <span
                    className="project-status-badge"
                    style={{
                      background: `${STATUS_COLORS[project.status]}20`,
                      color: STATUS_COLORS[project.status],
                      borderColor: `${STATUS_COLORS[project.status]}40`,
                    }}
                  >
                    {project.status}
                  </span>
                  {project.startDate && (
                    <span className="project-date">
                      <HiOutlineCalendar /> {project.startDate}
                      {project.endDate && ` → ${project.endDate}`}
                    </span>
                  )}
                </div>

                <div className="project-team-bar">
                  <div className="team-bar-header">
                    <span><HiOutlineUsers /> Team ({project.allocatedCount}/{project.requiredHeadcount})</span>
                  </div>
                  <div className="team-bar-track">
                    <div
                      className="team-bar-fill"
                      style={{
                        width: `${Math.min((project.allocatedCount / project.requiredHeadcount) * 100, 100)}%`,
                        background: project.allocatedCount >= project.requiredHeadcount ? 'var(--accent-green)' : 'var(--gradient-blue)',
                      }}
                    ></div>
                  </div>
                </div>

                {/* Manager: show allocations */}
                {isManagerOrAdmin && project.allocations && project.allocations.length > 0 && (
                  <div className="project-team-list">
                    {project.allocations.map((alloc) => (
                      <div key={alloc.id} className="team-member">
                        <div className="team-member-avatar">{alloc.employeeName?.charAt(0)?.toUpperCase()}</div>
                        <div className="team-member-info">
                          <span className="team-member-name">{alloc.employeeName}</span>
                          <span className="team-member-role">{alloc.designation || alloc.employeeEmail}</span>
                        </div>
                        <span className="team-member-percent">{alloc.allocationPercentage}%</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Employee: Apply Button */}
                {isEmployee && (
                  <div className="project-apply-section">
                    {existingApp ? (
                      <div className="applied-badge">
                        <HiOutlineClipboardCheck />
                        <span>Applied — {existingApp.status.replace('_', ' ')}</span>
                      </div>
                    ) : project.allocatedCount < project.requiredHeadcount ? (
                      <button
                        className="primary-btn apply-btn"
                        onClick={() => {
                          setApplyingProject(project);
                          setCoverNote('');
                          setApplyError('');
                          setShowApplyModal(true);
                        }}
                      >
                        <HiOutlinePaperAirplane /> Apply to Project
                      </button>
                    ) : (
                      <span className="team-full-badge">Team Full</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Manager: Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal project-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              {error && <div className="auth-error">{error}</div>}
              <div className="form-group">
                <label>Project Name *</label>
                <input value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} placeholder="Project Alpha" className="modal-input" />
              </div>
              <div className="form-group">
                <label>Client Name *</label>
                <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Acme Corp" className="modal-input" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Project details..." className="modal-input modal-textarea" rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="modal-input" />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="modal-input" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Required Headcount</label>
                  <input type="number" min="1" value={form.requiredHeadcount} onChange={(e) => setForm({ ...form, requiredHeadcount: parseInt(e.target.value) || 1 })} className="modal-input" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="modal-input">
                    <option value="PLANNING">Planning</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="primary-btn" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee: Apply Modal */}
      {showApplyModal && applyingProject && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply to {applyingProject.projectName}</h3>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              {applyError && <div className="auth-error">{applyError}</div>}
              <div className="apply-project-info">
                <p><strong>Client:</strong> {applyingProject.clientName}</p>
                {applyingProject.description && <p className="project-desc">{applyingProject.description}</p>}
              </div>
              <div className="form-group">
                <label>Cover Note (optional)</label>
                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Why are you a good fit for this project?"
                  className="modal-input modal-textarea"
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowApplyModal(false)}>Cancel</button>
              <button className="primary-btn" onClick={handleApply} disabled={saving}>
                <HiOutlinePaperAirplane /> {saving ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
