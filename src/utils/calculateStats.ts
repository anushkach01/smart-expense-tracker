import { Expense } from '../features/expenses/expenseSlice';
import { Budget } from '../features/budgets/budgetSlice';
import { isCurrentMonth } from './formatDate';

export interface DashboardStats {
  totalExpenses: number;
  monthlyBudget: number;
  savings: number;
  totalCategories: number;
  expenseChange: number;
  budgetChange: number;
  savingsChange: number;
}

export const calculateDashboardStats = (
  expenses: Expense[],
  budgets: Budget[]
): DashboardStats => {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyExpenses = expenses
    .filter((e) => isCurrentMonth(e.date))
    .reduce((sum, e) => sum + e.amount, 0);
  const monthlyBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const savings = monthlyBudget - monthlyExpenses;
  const totalCategories = new Set(expenses.map((e) => e.category)).size;

  return {
    totalExpenses,
    monthlyBudget,
    savings: savings > 0 ? savings : 0,
    totalCategories,
    expenseChange: 12.5,
    budgetChange: 8.3,
    savingsChange: 18.2,
  };
};

export const calculateCategoryData = (
  expenses: Expense[]
): { name: string; value: number; amount: number }[] => {
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce(
    (sum, val) => sum + val,
    0
  );

  return Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    value: Math.round((amount / total) * 100),
    amount,
  }));
};

export const calculateBudgetProgress = (
  budget: Budget
): { percentage: number; isOverBudget: boolean } => {
  const percentage = Math.round((budget.spent / budget.limit) * 100);
  return {
    percentage: Math.min(percentage, 100),
    isOverBudget: budget.spent > budget.limit,
  };
};