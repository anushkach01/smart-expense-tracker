import expensesData from '../mock/expenses.json';
import { Expense } from '../features/expenses/expenseSlice';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockExpenses: Expense[] = [...expensesData] as Expense[];

export const expenseService = {
  async getAll(): Promise<Expense[]> {
    await delay(500);
    return [...mockExpenses];
  },

  async getById(id: string): Promise<Expense> {
    await delay(300);
    const expense = mockExpenses.find((e) => e.id === id);
    if (!expense) throw new Error(`Expense with id ${id} not found`);
    return { ...expense };
  },

  async create(data: Omit<Expense, 'id'>): Promise<Expense> {
    await delay(600);
    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}`,
    };
    mockExpenses.unshift(newExpense);
    return { ...newExpense };
  },

  async update(id: string, data: Partial<Expense>): Promise<Expense> {
    await delay(600);
    const index = mockExpenses.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Expense with id ${id} not found`);
    mockExpenses[index] = { ...mockExpenses[index], ...data };
    return { ...mockExpenses[index] };
  },

  async delete(id: string): Promise<void> {
    await delay(400);
    const index = mockExpenses.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Expense with id ${id} not found`);
    mockExpenses = mockExpenses.filter((e) => e.id !== id);
  },

  async search(query: string, category?: string): Promise<Expense[]> {
    await delay(300);
    return mockExpenses.filter((e: Expense) => {
      const matchesQuery = e.title!
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory =
        !category || category === 'All' || e.category === category;
      return matchesQuery && matchesCategory;
    });
  },

  getTotalExpenses(): number {
    return mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  },

  getByCategory(): Record<string, number> {
    return mockExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
  },
};
