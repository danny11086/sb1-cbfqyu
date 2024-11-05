<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Transaction } from '$lib/types/transaction';
  import { TransactionType } from '$lib/types/transaction';
  import { format } from 'date-fns';

  export let transaction: Partial<Transaction> = {
    type: TransactionType.EXPENSE,
    amount: 0,
    currency: 'USD',
    date: new Date(),
    category: '',
    description: '',
    paymentMethod: 'cash'
  };

  const dispatch = createEventDispatcher();

  const categories = {
    [TransactionType.EXPENSE]: ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Other'],
    [TransactionType.INCOME]: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
    [TransactionType.TRANSFER]: ['Account Transfer']
  };

  const paymentMethods = ['cash', 'credit card', 'debit card', 'bank transfer', 'other'];

  function handleSubmit() {
    dispatch('submit', transaction);
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-700">Type</label>
    <select
      bind:value={transaction.type}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      {#each Object.values(TransactionType) as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700">Amount</label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-500 sm:text-sm">$</span>
      </div>
      <input
        type="number"
        bind:value={transaction.amount}
        min="0"
        step="0.01"
        class="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required
      />
    </div>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700">Date</label>
    <input
      type="date"
      bind:value={transaction.date}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700">Category</label>
    <select
      bind:value={transaction.category}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required>
      <option value="">Select category</option>
      {#each categories[transaction.type || TransactionType.EXPENSE] as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700">Description</label>
    <input
      type="text"
      bind:value={transaction.description}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700">Payment Method</label>
    <select
      bind:value={transaction.paymentMethod}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required>
      {#each paymentMethods as method}
        <option value={method}>{method}</option>
      {/each}
    </select>
  </div>

  <div class="flex justify-end">
    <button
      type="submit"
      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      Save Transaction
    </button>
  </div>
</form>