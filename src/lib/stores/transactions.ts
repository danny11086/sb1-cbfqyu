import { writable } from 'svelte/store';
import type { Transaction } from '$lib/types/transaction';

function createTransactionsStore() {
  const { subscribe, set, update } = writable<Transaction[]>([]);

  return {
    subscribe,
    add: (transaction: Transaction) => update(transactions => [...transactions, transaction]),
    remove: (id: string) => update(transactions => 
      transactions.filter(t => t.id !== id)
    ),
    update: (id: string, updatedTransaction: Partial<Transaction>) => update(transactions =>
      transactions.map(t => t.id === id ? { ...t, ...updatedTransaction } : t)
    ),
    clear: () => set([])
  };
}

export const transactions = createTransactionsStore();