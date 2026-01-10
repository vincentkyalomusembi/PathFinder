export const formatSalary = (salary) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(salary);

export const formatDate = (date) => new Intl.DateTimeFormat('en-US').format(new Date(date));