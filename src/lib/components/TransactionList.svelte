<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Transaction } from '$lib/types/transaction';
  import { format } from 'date-fns';

  export let transactions: Transaction[] = [];
  
  const dispatch = createEventDispatcher();

  function handleDelete(id: string) {
    dispatch('delete', id);
  }

  function handleEdit(transaction: Transaction) {
    dispatch('edit', transaction);
  }

  function getTypeColor(type: string): string {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  }
</script>

<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each transactions as transaction (transaction.id)}
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {format(transaction.date, 'MMM d, yyyy')}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm {getTypeColor(transaction.type)}">
            {transaction.type}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {transaction.category}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {transaction.description}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm {getTypeColor(transaction.type)}">
            ${transaction.amount.toFixed(2)}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              on:click={() => handleEdit(transaction)}
              class="text-indigo-600 hover:text-indigo-900 mr-4">
              Edit
            </button>
            <button
              on:click={() => handleDelete(transaction.id)}
              class="text-red-600 hover:text-red-900">
              Delete
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>