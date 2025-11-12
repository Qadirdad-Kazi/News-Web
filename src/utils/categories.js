export const CATEGORIES = [
  { key: 'software-engineering', label: 'Software Engineering', icon: 'Code' },
  { key: 'devops', label: 'DevOps', icon: 'Server' },
  { key: 'ai-ml', label: 'AI/ML', icon: 'Brain' },
  { key: 'security', label: 'Security', icon: 'Shield' },
  { key: 'general-tech', label: 'General Tech', icon: 'Laptop' },
  { key: 'business', label: 'Business', icon: 'TrendingUp' },
  { key: 'lifestyle', label: 'Lifestyle', icon: 'Heart' },
];

export const getCategoryLabel = (key) => {
  const category = CATEGORIES.find(cat => cat.key === key);
  return category ? category.label : key;
};
