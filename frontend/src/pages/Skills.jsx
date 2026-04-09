import { useState, useEffect } from 'react';
import { skillAPI } from '../api/axios';
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineStar,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineCode,
  HiOutlineDatabase,
  HiOutlineCloud,
  HiOutlineCog,
  HiOutlineX,
} from 'react-icons/hi';

const CATEGORY_ICONS = {
  LANGUAGE: <HiOutlineCode />,
  FRAMEWORK: <HiOutlineCog />,
  DATABASE: <HiOutlineDatabase />,
  TOOL: <HiOutlineCog />,
  CLOUD: <HiOutlineCloud />,
  OTHER: <HiOutlineCog />,
};

const CATEGORY_COLORS = {
  LANGUAGE: '#3b82f6',
  FRAMEWORK: '#8b5cf6',
  DATABASE: '#14b8a6',
  TOOL: '#f59e0b',
  CLOUD: '#ec4899',
  OTHER: '#64748b',
};

const Skills = () => {
  const [mySkills, setMySkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [addForm, setAddForm] = useState({ skillId: null, proficiency: 3, yearsOfExperience: 1 });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [myRes, allRes] = await Promise.all([
        skillAPI.getMySkills(),
        skillAPI.getAllSkills(),
      ]);
      setMySkills(myRes.data);
      setAllSkills(allRes.data);
    } catch (err) {
      console.error('Failed to fetch skills', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!addForm.skillId) {
      setError('Please select a skill');
      return;
    }
    setAdding(true);
    setError('');
    try {
      const res = await skillAPI.addSkill(addForm);
      setMySkills([...mySkills, res.data]);
      setShowAddModal(false);
      setAddForm({ skillId: null, proficiency: 3, yearsOfExperience: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveSkill = async (employeeSkillId) => {
    if (!confirm('Remove this skill from your profile?')) return;
    try {
      await skillAPI.removeSkill(employeeSkillId);
      setMySkills(mySkills.filter((s) => s.id !== employeeSkillId));
    } catch (err) {
      console.error('Failed to remove skill', err);
    }
  };

  const mySkillIds = mySkills.map((s) => s.skillId);
  const availableSkills = allSkills.filter((s) => !mySkillIds.includes(s.id));

  const filteredCatalog = availableSkills.filter((s) => {
    const matchesSearch = s.skillName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', ...new Set(allSkills.map((s) => s.category))];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <HiOutlineStar
        key={i}
        className={`star ${i < rating ? 'filled' : ''}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="skills-page">
      <div className="page-header">
        <div>
          <h1>My Skills</h1>
          <p>Manage your technical skills and proficiency levels</p>
        </div>
        <button className="primary-btn" onClick={() => setShowAddModal(true)}>
          <HiOutlinePlus /> Add Skill
        </button>
      </div>

      {/* My Skills Grid */}
      {mySkills.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚡</div>
          <h3>No skills added yet</h3>
          <p>Add your first skill to showcase your expertise</p>
          <button className="primary-btn" onClick={() => setShowAddModal(true)}>
            <HiOutlinePlus /> Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="my-skills-grid">
          {mySkills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <div className="skill-card-header">
                <div className="skill-category-icon" style={{ background: CATEGORY_COLORS[skill.category] }}>
                  {CATEGORY_ICONS[skill.category]}
                </div>
                <button className="skill-remove-btn" onClick={() => handleRemoveSkill(skill.id)} title="Remove skill">
                  <HiOutlineTrash />
                </button>
              </div>
              <h4 className="skill-name">{skill.skillName}</h4>
              <span className="skill-category-tag" style={{ color: CATEGORY_COLORS[skill.category] }}>
                {skill.category}
              </span>
              <div className="skill-rating">
                <span className="rating-label">Proficiency</span>
                <div className="star-rating">{renderStars(skill.proficiency)}</div>
              </div>
              <div className="skill-experience">
                <span>{skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} experience</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add a Skill</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <HiOutlineX />
              </button>
            </div>

            {error && <div className="auth-error">{error}</div>}

            {/* Search & Filter */}
            <div className="modal-search">
              <div className="input-wrapper">
                <HiOutlineSearch className="input-icon" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Skill List */}
            <div className="skill-select-list">
              {filteredCatalog.map((skill) => (
                <button
                  key={skill.id}
                  className={`skill-select-item ${addForm.skillId === skill.id ? 'selected' : ''}`}
                  onClick={() => setAddForm({ ...addForm, skillId: skill.id })}
                >
                  <span className="skill-select-icon" style={{ color: CATEGORY_COLORS[skill.category] }}>
                    {CATEGORY_ICONS[skill.category]}
                  </span>
                  <span className="skill-select-name">{skill.skillName}</span>
                  <span className="skill-select-cat">{skill.category}</span>
                </button>
              ))}
              {filteredCatalog.length === 0 && (
                <p className="no-results">No skills found matching your criteria</p>
              )}
            </div>

            {/* Proficiency & Experience */}
            {addForm.skillId && (
              <div className="add-skill-config">
                <div className="config-row">
                  <label>Proficiency (1-5)</label>
                  <div className="star-selector">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`star-btn ${i < addForm.proficiency ? 'active' : ''}`}
                        onClick={() => setAddForm({ ...addForm, proficiency: i + 1 })}
                      >
                        <HiOutlineStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="config-row">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={addForm.yearsOfExperience}
                    onChange={(e) => setAddForm({ ...addForm, yearsOfExperience: parseFloat(e.target.value) || 0 })}
                    className="exp-input"
                  />
                </div>
              </div>
            )}

            <button
              className="primary-btn modal-submit"
              onClick={handleAddSkill}
              disabled={!addForm.skillId || adding}
            >
              {adding ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
