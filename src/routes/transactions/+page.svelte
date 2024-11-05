<script lang="ts">
  import { onMount } from 'svelte';
  import TransactionForm from '$lib/components/TransactionForm.svelte';
  import TransactionList from '$lib/components/TransactionList.svelte';
  import { createTransaction, updateTransaction, deleteTransaction } from '$lib/api';
  import { v4 as uuid } from 'uuid';

  export let data;
  let transactions = data.transactions;
  let showForm = false;
  let editingTransaction: any = null;

  async function handleSubmit(event: CustomEvent) {
    const transaction = event.detail;
    try {
      if (editingTransaction) {
        const updated = await updateTransaction(editingTransaction.id, {
          ...transaction,
          updatedAt: new Date()
        });
        transactions = transactions.map(t => 
          t.id === updated.id ? updated : t
        );
      } else {
        const created = await createTransaction({
          ...transaction,
          id: uuid(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        transactions = [...transactions, created];
      }
      showForm = false;
      editingTransaction = null;
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert('Failed to save transaction');
    }
  }

  async function handleDelete(event: CustomEvent) {
    const id = event.detail;
    try {
      await deleteTransaction(id);
      transactions = transactions.filter(t => t.id !== id);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      alert('Failed to delete transaction');
    }
  }

  function handleEdit(event: CustomEvent) {
    editingTransaction = event.detail;
    showForm = true;
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-semibold text-gray-900">Transactions</h1>
    <button
      on:click={() => {
        editingTransaction = null;
        showForm = !showForm;
      }}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      {showForm ? 'Cancel' : 'Add Transaction'}
    </button>
  </div>

  {#if showForm}
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">
        {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
      </h2>
      <TransactionForm
        transaction={editingTransaction || {}}
        on:submit={handleSubmit}
      />
    </div>
  {/if}

  <div class="bg-white shadow rounded-lg">
    <TransactionList
      {transactions}
      on:delete={handleDelete}
      on:edit={handleEdit}
    />
  </div>
</div>