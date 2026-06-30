import budgetsData from '../mock/budgets.json';
import { Budget } from '../features/budgets/budgetSlice';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockBudgets: Budget[] = (budgetsData as unknown as Array<{ id: string; name: string; category: string; allocated: number; spent: number; icon: string }>).map(b => ({
  ...b,
  limit: b.allocated,
  userId: 'user-1',
})) as Budget[];

export const budgetService = {
  async getAll(): Promise<Budget[]> {
    await delay(500);
    return [...mockBudgets];
  },

  async getById(id: string): Promise<Budget> {
    await delay(300);
    const budget = mockBudgets.find((b) => b.id === id);
    if (!budget) throw new Error(`Budget with id ${id} not found`);
    return { ...budget };
  },

  async create(data: Omit<Budget, 'id'>): Promise<Budget> {
    await delay(600);
    const newBudget: Budget = {
      ...data,
      id: `bud-${Date.now()}`,
    };
    mockBudgets.push(newBudget);
    return { ...newBudget };
  },

  async update(id: string, data: Partial<Budget>): Promise<Budget> {
    await delay(600);
    const index = mockBudgets.findIndex((b) => b.id === id);
    if (index === -1) throw new Error(`Budget with id ${id} not found`);
    mockBudgets[index] = { ...mockBudgets[index], ...data };
    return { ...mockBudgets[index] };
  },

  async delete(id: string): Promise<void> {
    await delay(400);
    const index = mockBudgets.findIndex((b) => b.id === id);
    if (index === -1) throw new Error(`Budget with id ${id} not found`);
    mockBudgets = mockBudgets.filter((b) => b.id !== id);
  },

  getTotalAllocated(): number {
    return mockBudgets.reduce((sum, b) => sum + b.limit, 0);
  },

  getTotalSpent(): number {
    return mockBudgets.reduce((sum, b) => sum + b.spent, 0);
  },

  getTotalSavings(): number {
    return this.getTotalAllocated() - this.getTotalSpent();
  },
};