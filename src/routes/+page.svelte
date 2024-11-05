<script lang="ts">
  import { onMount } from 'svelte';
  import { transactions } from '$lib/stores/transactions';
  import { Chart } from 'chart.js/auto';
  import { Line } from 'svelte-chartjs';

  let totalIncome = 0;
  let totalExpenses = 0;
  let balance = 0;

  $: {
    totalIncome = $transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    totalExpenses = $transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    balance = totalIncome - totalExpenses;
  }

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Income',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Expenses',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };
</script>

<div class="space-y-6">
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">Total Income</dt>
        <dd class="mt-1 text-3xl font-semibold text-green-600">${totalIncome.toFixed(2)}</dd>
      </div>
    </div>

    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
        <dd class="mt-1 text-3xl font-semibold text-red-600">${totalExpenses.toFixed(2)}</dd>
      </div>
    </div>

    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">Current Balance</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">${balance.toFixed(2)}</dd>
      </div>
    </div>
  </div>

  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Income vs Expenses</h2>
    <Line data={chartData} options={{ responsive: true }} />
  </div>
</div>