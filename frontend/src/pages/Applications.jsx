import { useState, useEffect } from 'react';
import { applicationAPI } from '../api/axios';
import {
  HiOutlineClipboardCheck,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlineClock,
} from 'react-icons/hi';

const APP_STATUS_COLORS = {
  PENDING: '#f59e0b',
  INTERVIEW_SCHEDULED: '#3b82f6',
  ACCEPTED: '#10b981',
  REJECTED: '#ef4444',
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    status: '',
    managerNotes: '',
    interviewDate: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await applicationAPI.getAllApplications();
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const openReview = (app, defaultStatus) => {
    setSelectedApp(app);
    setReviewForm({
      status: defaultStatus,
      managerNotes: '',
      interviewDate: '',
    });
    setShowReviewModal(true);
  };

  const handleReview = async () => {
    setSaving(true);
    try {
      const payload = {
        status: reviewForm.status,
        managerNotes: reviewForm.managerNotes || null,
        interviewDate: reviewForm.interviewDate
          ? new Date(reviewForm.interviewDate).toISOString()
          : null,
      };
      await applicationAPI.reviewApplication(selectedApp.id, payload);
      setShowReviewModal(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      console.error('Review failed', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredApps =
    filterStatus === 'ALL'
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'PENDING').length,
    interviews: applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length,
    accepted: applications.filter((a) => a.status === 'ACCEPTED').length,
    rejected: applications.filter((a) => a.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>Review employee project applications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="app-stats">
        <div className={`app-stat ${filterStatus === 'ALL' ? 'active' : ''}`} onClick={() => setFilterStatus('ALL')}>
          <HiOutlineClipboardCheck className="app-stat-icon" />
          <span className="app-stat-value">{stats.total}</span>
          <span className="app-stat-label">Total</span>
        </div>
        <div className={`app-stat ${filterStatus === 'PENDING' ? 'active' : ''}`} onClick={() => setFilterStatus('PENDING')}>
          <span className="app-stat-dot" style={{ background: APP_STATUS_COLORS.PENDING }}></span>
          <span className="app-stat-value">{stats.pending}</span>
          <span className="app-stat-label">Pending</span>
        </div>
        <div className={`app-stat ${filterStatus === 'INTERVIEW_SCHEDULED' ? 'active' : ''}`} onClick={() => setFilterStatus('INTERVIEW_SCHEDULED')}>
          <span className="app-stat-dot" style={{ background: APP_STATUS_COLORS.INTERVIEW_SCHEDULED }}></span>
          <span className="app-stat-value">{stats.interviews}</span>
          <span className="app-stat-label">Interviews</span>
        </div>
        <div className={`app-stat ${filterStatus === 'ACCEPTED' ? 'active' : ''}`} onClick={() => setFilterStatus('ACCEPTED')}>
          <span className="app-stat-dot" style={{ background: APP_STATUS_COLORS.ACCEPTED }}></span>
          <span className="app-stat-value">{stats.accepted}</span>
          <span className="app-stat-label">Accepted</span>
        </div>
        <div className={`app-stat ${filterStatus === 'REJECTED' ? 'active' : ''}`} onClick={() => setFilterStatus('REJECTED')}>
          <span className="app-stat-dot" style={{ background: APP_STATUS_COLORS.REJECTED }}></span>
          <span className="app-stat-value">{stats.rejected}</span>
          <span className="app-stat-label">Rejected</span>
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No applications{filterStatus !== 'ALL' ? ` with status "${filterStatus.replace('_', ' ')}"` : ''}</h3>
          <p>Applications from employees will appear here</p>
        </div>
      ) : (
        <div className="app-list">
          {filteredApps.map((app) => (
            <div key={app.id} className="app-card">
              <div className="app-card-left">
                <div className="app-avatar">
                  {app.applicantName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="app-info">
                  <h4 className="app-applicant-name">{app.applicantName}</h4>
                  <div className="app-details">
                    <span><HiOutlineMail /> {app.applicantEmail}</span>
                    {app.applicantDesignation && <span><HiOutlineBriefcase /> {app.applicantDesignation}</span>}
                    {app.applicantDepartment && <span><HiOutlineOfficeBuilding /> {app.applicantDepartment}</span>}
                  </div>
                  <div className="app-project-info">
                    <span className="app-project-label">Applied for:</span>
                    <span className="app-project-name">{app.projectName}</span>
                    <span className="app-project-client">({app.clientName})</span>
                  </div>
                  {app.coverNote && <p className="app-cover-note">"{app.coverNote}"</p>}
                  {app.managerNotes && (
                    <p className="app-manager-notes"><strong>Your notes:</strong> {app.managerNotes}</p>
                  )}
                  {app.interviewDate && (
                    <span className="app-interview-info">
                      <HiOutlineCalendar /> Interview: {new Date(app.interviewDate).toLocaleString()}
                    </span>
                  )}
                  <span className="app-applied-time">
                    <HiOutlineClock /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="app-card-right">
                <span
                  className="app-status-badge-lg"
                  style={{
                    background: `${APP_STATUS_COLORS[app.status]}15`,
                    color: APP_STATUS_COLORS[app.status],
                    borderColor: `${APP_STATUS_COLORS[app.status]}30`,
                  }}
                >
                  {app.status.replace('_', ' ')}
                </span>

                {(app.status === 'PENDING' || app.status === 'INTERVIEW_SCHEDULED') && (
                  <div className="app-card-actions">
                    {app.status === 'PENDING' && (
                      <button className="action-btn interview" onClick={() => openReview(app, 'INTERVIEW_SCHEDULED')}>
                        <HiOutlineCalendar /> Schedule Interview
                      </button>
                    )}
                    <button className="action-btn accept" onClick={() => openReview(app, 'ACCEPTED')}>
                      <HiOutlineCheck /> Accept
                    </button>
                    <button className="action-btn reject" onClick={() => openReview(app, 'REJECTED')}>
                      <HiOutlineX /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedApp && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {reviewForm.status === 'INTERVIEW_SCHEDULED' ? 'Schedule Interview' :
                 reviewForm.status === 'ACCEPTED' ? 'Accept Application' : 'Reject Application'}
              </h3>
              <button className="modal-close" onClick={() => setShowReviewModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="review-applicant-info">
                <p><strong>Applicant:</strong> {selectedApp.applicantName} ({selectedApp.applicantEmail})</p>
                <p><strong>Project:</strong> {selectedApp.projectName}</p>
                {selectedApp.coverNote && <p><strong>Cover Note:</strong> "{selectedApp.coverNote}"</p>}
              </div>

              {reviewForm.status === 'INTERVIEW_SCHEDULED' && (
                <div className="form-group">
                  <label>Interview Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={reviewForm.interviewDate}
                    onChange={(e) => setReviewForm({ ...reviewForm, interviewDate: e.target.value })}
                    className="modal-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  value={reviewForm.managerNotes}
                  onChange={(e) => setReviewForm({ ...reviewForm, managerNotes: e.target.value })}
                  placeholder={
                    reviewForm.status === 'INTERVIEW_SCHEDULED'
                      ? 'Interview location, agenda, or instructions...'
                      : 'Any feedback or notes...'
                  }
                  className="modal-input modal-textarea"
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowReviewModal(false)}>Cancel</button>
              <button
                className={`primary-btn ${reviewForm.status === 'REJECTED' ? 'danger-btn' : ''}`}
                onClick={handleReview}
                disabled={saving || (reviewForm.status === 'INTERVIEW_SCHEDULED' && !reviewForm.interviewDate)}
              >
                {saving ? 'Processing...' :
                 reviewForm.status === 'INTERVIEW_SCHEDULED' ? 'Schedule Interview' :
                 reviewForm.status === 'ACCEPTED' ? 'Accept' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
