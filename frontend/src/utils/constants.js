export const MOCK_JOBS = [
  { id: 1, title: 'Frontend Dev', company: 'xAI', salary: 85000, location: 'Remote', category: 'tech', description: 'A cool app I built.', skills: ['React'] },
  { id: 2, title: 'Teacher', company: 'School', salary: 45000, location: 'NYC', category: 'teaching', description: 'Another awesome thing.', skills: ['Education'] },
  // Add more as needed
];

export const MOCK_DEMAND = { tech: 50000, teaching: 20000, hospitality: 15000, agriculture: 10000 };

// Array mocks for charts/reduce (Recharts expects this)
export const MOCK_DEMAND_TRENDS = [
  { month: 'Jan', jobs: 100 },
  { month: 'Feb', jobs: 120 },
  { month: 'Mar', jobs: 110 },
  { month: 'Apr', jobs: 130 },
  { month: 'May', jobs: 140 },
  { month: 'Jun', jobs: 150 },
];

export const MOCK_SALARY_TRENDS = [
  { category: 'Tech', salary: 120000 },
  { category: 'Teaching', salary: 60000 },
  { category: 'Hospitality', salary: 50000 },
  { category: 'Agriculture', salary: 55000 },
];

export const CATEGORIES = ['tech', 'teaching', 'hospitality', 'agriculture'];