export const truncateText = (text, maxLength = 100) => text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

export const getCategoryColor = (category) => {
  const colors = { tech: 'primary', teaching: 'success', hospitality: 'warning', agriculture: 'error' };
  return colors[category] || 'secondary';
};