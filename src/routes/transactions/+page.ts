import { fetchTransactions } from '$lib/api';

export async function load() {
  try {
    const transactions = await fetchTransactions();
    return { transactions };
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return { transactions: [] };
  }
}