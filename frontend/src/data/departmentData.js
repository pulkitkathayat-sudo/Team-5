// Department → Designation mapping
// Selecting a department shows only its designations
// Selecting a designation auto-selects its department

export const DEPARTMENT_DESIGNATIONS = {
  'Engineering': [
    'Junior Software Engineer',
    'Software Engineer',
    'Senior Software Engineer',
    'Lead Engineer',
    'Staff Engineer',
    'Principal Engineer',
    'Software Architect',
    'Engineering Manager',
    'Director of Engineering',
    'VP of Engineering',
  ],
  'Product': [
    'Associate Product Manager',
    'Product Manager',
    'Senior Product Manager',
    'Group Product Manager',
    'Director of Product',
    'VP of Product',
  ],
  'Design': [
    'UI Designer',
    'UX Designer',
    'Senior UX Designer',
    'UX Researcher',
    'Design Lead',
    'Head of Design',
  ],
  'Quality Assurance': [
    'QA Analyst',
    'QA Engineer',
    'Senior QA Engineer',
    'QA Automation Engineer',
    'QA Lead',
    'QA Manager',
  ],
  'DevOps': [
    'DevOps Engineer',
    'Senior DevOps Engineer',
    'SRE Engineer',
    'DevOps Lead',
    'Cloud Engineer',
    'DevOps Manager',
  ],
  'Data Science': [
    'Data Analyst',
    'Data Scientist',
    'Senior Data Scientist',
    'ML Engineer',
    'AI Research Engineer',
    'Data Science Lead',
  ],
  'Data Engineering': [
    'Data Engineer',
    'Senior Data Engineer',
    'ETL Developer',
    'Data Architect',
    'Data Engineering Lead',
  ],
  'Cybersecurity': [
    'Security Analyst',
    'Security Engineer',
    'Senior Security Engineer',
    'Penetration Tester',
    'Security Architect',
    'CISO',
  ],
  'IT Infrastructure': [
    'System Administrator',
    'Network Engineer',
    'Senior System Administrator',
    'IT Support Specialist',
    'Infrastructure Lead',
    'IT Manager',
  ],
  'Project Management': [
    'Project Coordinator',
    'Project Manager',
    'Senior Project Manager',
    'Program Manager',
    'PMO Lead',
    'Director of PM',
  ],
  'Business Analysis': [
    'Junior Business Analyst',
    'Business Analyst',
    'Senior Business Analyst',
    'Lead Business Analyst',
    'Business Analysis Manager',
  ],
  'Marketing': [
    'Marketing Coordinator',
    'Marketing Specialist',
    'Digital Marketing Manager',
    'Content Strategist',
    'SEO Specialist',
    'Marketing Manager',
    'VP of Marketing',
  ],
  'Sales': [
    'Sales Development Rep',
    'Account Executive',
    'Senior Account Executive',
    'Sales Manager',
    'Director of Sales',
    'VP of Sales',
  ],
  'Human Resources': [
    'HR Coordinator',
    'HR Business Partner',
    'Recruiter',
    'Senior Recruiter',
    'HR Manager',
    'Director of HR',
  ],
  'Finance': [
    'Financial Analyst',
    'Senior Financial Analyst',
    'Accountant',
    'Finance Manager',
    'Controller',
    'CFO',
  ],
  'Operations': [
    'Operations Analyst',
    'Operations Coordinator',
    'Operations Manager',
    'Director of Operations',
    'COO',
  ],
  'Customer Success': [
    'Customer Support Specialist',
    'Customer Success Manager',
    'Senior CSM',
    'Technical Support Engineer',
    'Support Lead',
    'Head of Customer Success',
  ],
  'Legal': [
    'Paralegal',
    'Legal Counsel',
    'Senior Legal Counsel',
    'Compliance Officer',
    'General Counsel',
  ],
  'Research': [
    'Research Analyst',
    'Research Scientist',
    'Senior Research Scientist',
    'R&D Engineer',
    'Research Lead',
    'Director of Research',
  ],
};

export const DEPARTMENTS = Object.keys(DEPARTMENT_DESIGNATIONS);

export const ALL_DESIGNATIONS = Object.entries(DEPARTMENT_DESIGNATIONS).flatMap(
  ([dept, desigs]) => desigs.map((d) => ({ designation: d, department: dept }))
);

export function getDesignationsForDepartment(department) {
  return DEPARTMENT_DESIGNATIONS[department] || [];
}

export function getDepartmentForDesignation(designation) {
  for (const [dept, desigs] of Object.entries(DEPARTMENT_DESIGNATIONS)) {
    if (desigs.includes(designation)) return dept;
  }
  return null;
}
