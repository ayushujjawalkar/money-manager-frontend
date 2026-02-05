export const INCOME_CATEGORIES = [
  { value: 'salary', label: 'Salary', icon: '💰' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'investment', label: 'Investment', icon: '📈' },
  { value: 'other-income', label: 'Other Income', icon: '💵' },
];

export const EXPENSE_CATEGORIES = [
  { value: 'fuel', label: 'Fuel', icon: '⛽' },
  { value: 'movie', label: 'Movie', icon: '🎬' },
  { value: 'food', label: 'Food', icon: '🍔' },
  { value: 'loan', label: 'Loan', icon: '🏦' },
  { value: 'medical', label: 'Medical', icon: '🏥' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'utilities', label: 'Utilities', icon: '💡' },
  { value: 'rent', label: 'Rent', icon: '🏠' },
  { value: 'transportation', label: 'Transportation', icon: '🚗' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎮' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'other-expense', label: 'Other Expense', icon: '💳' },
];

export const DIVISIONS = [
  { value: 'office', label: 'Office', icon: '🏢' },
  { value: 'personal', label: 'Personal', icon: '👤' },
];

export const ACCOUNTS = [
  { value: 'main', label: 'Main Account', icon: '🏦' },
  { value: 'savings', label: 'Savings', icon: '💰' },
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'credit-card', label: 'Credit Card', icon: '💳' },
];

export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income', color: 'text-success-600' },
  { value: 'expense', label: 'Expense', color: 'text-danger-600' },
  { value: 'transfer', label: 'Transfer', color: 'text-primary-600' },
];

export const PERIOD_OPTIONS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export const getCategoryIcon = (category) => {
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  const found = allCategories.find(cat => cat.value === category);
  return found ? found.icon : '📝';
};

export const getCategoryLabel = (category) => {
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  const found = allCategories.find(cat => cat.value === category);
  return found ? found.label : category;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
