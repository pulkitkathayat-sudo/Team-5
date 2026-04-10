import { useState, useEffect } from 'react';
import { searchAPI } from '../api/axios';
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineUser,
  HiOutlineStar,
  HiOutlineBriefcase,
  HiOutlineMail,
} from 'react-icons/hi';

const Search = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({
    skill: '',
    availability: 'ALL',
    department: '',
    name: '',
  });

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (filters.skill) params.skill = filters.skill;
      if (filters.availability !== 'ALL') params.availability = filters.availability;
      if (filters.department) params.department = filters.department;
      if (filters.name) params.name = filters.name;

      const res = await searchAPI.searchEmployees(params);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <HiOutlineStar key={i} className={`star-sm ${i < rating ? 'filled' : ''}`} />
    ));

  return (
    <div className="search-page">
      <div className="page-header">
        <div>
          <h1>Search Employees</h1>
          <p>Find the right talent for your projects</p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="search-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Employee Name</label>
            <div className="input-wrapper">
              <HiOutlineUser className="input-icon" />
              <input
                placeholder="Search by name..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>Skill</label>
            <div className="input-wrapper">
              <HiOutlineSearch className="input-icon" />
              <input
                placeholder="e.g. React, Java..."
                value={filters.skill}
                onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>Department</label>
            <div className="input-wrapper">
              <HiOutlineBriefcase className="input-icon" />
              <input
                placeholder="e.g. Engineering"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>Availability</label>
            <div className="input-wrapper select-wrapper">
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
              >
                <option value="ALL">All</option>
                <option value="AVAILABLE">Available</option>
                <option value="ON_PROJECT">On Project</option>
                <option value="ON_BENCH">On Bench</option>
              </select>
            </div>
          </div>
        </div>
        <button className="primary-btn search-btn" onClick={handleSearch} disabled={loading}>
          <HiOutlineSearch /> {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Results */}
      {searched && !loading && (
        <div className="search-results">
          <p className="results-count">{results.length} employee{results.length !== 1 ? 's' : ''} found</p>

          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No employees found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="results-grid">
              {results.map((emp) => (
                <div key={emp.id} className="employee-card">
                  <div className="emp-card-header">
                    <div className="emp-avatar">
                      {emp.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="emp-info">
                      <h4>{emp.name}</h4>
                      <span className="emp-designation">{emp.designation || 'No designation'}</span>
                    </div>
                    <span className={`status-pill status-${emp.availabilityStatus?.toLowerCase()}`}>
                      {emp.availabilityStatus?.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="emp-details-row">
                    <span className="emp-detail"><HiOutlineMail /> {emp.email}</span>
                    {emp.department && <span className="emp-detail"><HiOutlineBriefcase /> {emp.department}</span>}
                  </div>

                  {emp.skills && emp.skills.length > 0 && (
                    <div className="emp-skills">
                      <span className="emp-skills-label">Skills ({emp.skillCount})</span>
                      <div className="emp-skill-tags">
                        {emp.skills.slice(0, 6).map((skill) => (
                          <div key={skill.id} className="skill-tag">
                            <span className="skill-tag-name">{skill.skillName}</span>
                            <span className="skill-tag-stars">{renderStars(skill.proficiency)}</span>
                          </div>
                        ))}
                        {emp.skills.length > 6 && (
                          <span className="skill-tag more">+{emp.skills.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
