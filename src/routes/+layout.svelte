<script lang="ts">
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';
  import '../app.css';

  function handleLogout() {
    auth.logout();
    window.location.href = '/login';
  }
</script>

<div class="min-h-screen bg-gray-50">
  {#if $auth.token && !['/login', '/register'].includes($page.url.pathname)}
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Personal Accounting</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="/" class="nav-link" class:active={$page.url.pathname === '/'}>
                Dashboard
              </a>
              <a href="/transactions" class="nav-link" class:active={$page.url.pathname === '/transactions'}>
                Transactions
              </a>
              <a href="/budgets" class="nav-link" class:active={$page.url.pathname === '/budgets'}>
                Budgets
              </a>
              <a href="/reports" class="nav-link" class:active={$page.url.pathname === '/reports'}>
                Reports
              </a>
            </div>
          </div>
          <div class="flex items-center">
            <button
              on:click={handleLogout}
              class="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  {:else}
    <slot />
  {/if}
</div>

<style>
  .nav-link {
    @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700;
  }
  .nav-link.active {
    @apply border-b-2 border-indigo-500 text-gray-900;
  }
</style>