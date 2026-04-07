import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  DEPARTMENTS,
  getDesignationsForDepartment,
  getDepartmentForDesignation,
  ALL_DESIGNATIONS,
} from '../data/departmentData';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePhone,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'EMPLOYEE',
    designation: '',
    department: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setFormData({ ...formData, department: dept, designation: '' });
  };

  const handleDesignationChange = (e) => {
    const desig = e.target.value;
    const dept = getDepartmentForDesignation(desig);
    if (dept) {
      setFormData({ ...formData, designation: desig, department: dept });
    } else {
      setFormData({ ...formData, designation: desig });
    }
  };

  const availableDesignations = formData.department
    ? getDesignationsForDepartment(formData.department)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.department) {
      setError('Please select a department');
      return;
    }

    if (!formData.designation) {
      setError('Please select a designation');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-left">
          <div className="auth-brand">
            <span className="auth-logo">⚡</span>
            <h1>SkillHub</h1>
            <p>Enterprise Resource & Skill Management</p>
          </div>
          <div className="auth-features">
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>Create your professional profile</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>Showcase your skills & certifications</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>Apply to projects & grow your career</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Join your organization on SkillHub</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <HiOutlineUser className="input-icon" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="reg-email">Email</label>
                  <div className="input-wrapper">
                    <HiOutlineMail className="input-icon" />
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-password">Password</label>
                  <div className="input-wrapper">
                    <HiOutlineLockClosed className="input-icon" />
                    <input
                      id="reg-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <HiOutlineLockClosed className="input-icon" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <div className="input-wrapper select-wrapper">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="MANAGER">Resource Manager</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <div className="input-wrapper">
                    <HiOutlinePhone className="input-icon" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department">Department *</label>
                  <div className="input-wrapper select-wrapper">
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleDepartmentChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="designation">Designation *</label>
                  <div className="input-wrapper select-wrapper">
                    <select
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleDesignationChange}
                      required
                      disabled={!formData.department}
                      className={!formData.department ? 'disabled-select' : ''}
                    >
                      <option value="">
                        {formData.department ? 'Select Designation' : 'Select Department first'}
                      </option>
                      {availableDesignations.map((desig) => (
                        <option key={desig} value={desig}>{desig}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
