import { writable } from 'svelte/store';
import type { Budget } from '$lib/types/budget';

function createBudgetsStore() {
  const { subscribe, set, update } = writable<Budget[]>([]);

  return {
    subscribe,
    add: (budget: Budget) => update(budgets => [...budgets, budget]),
    remove: (id: string) => update(budgets => 
      budgets.filter(b => b.id !== id)
    ),
    update: (id: string, updatedBudget: Partial<Budget>) => update(budgets =>
      budgets.map(b => b.id === id ? { ...b, ...updatedBudget } : b)
    ),
    updateSpent: (category: string, amount: number) => update(budgets =>
      budgets.map(b => b.category === category ? { ...b, spent: b.spent + amount } : b)
    ),
    clear: () => set([])
  };
}

export const budgets = createBudgetsStore();