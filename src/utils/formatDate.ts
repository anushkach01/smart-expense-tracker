export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

export const formatInputDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const getCurrentMonth = (): string => {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());
};

export const isCurrentMonth = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};