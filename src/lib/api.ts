import { auth } from './stores/auth';

const API_BASE_URL = 'http://localhost:8000/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token: string | null = null;
  auth.subscribe(state => token = state.token)();

  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  const response = await fetch(`${API_BASE_URL}${url}`, options);
  
  if (response.status === 401) {
    auth.logout();
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) {
    throw new Error('API request failed');
  }
  
  return response.json();
}

export async function login(email: string, password: string) {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/token`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  auth.login(data.access_token);
  return data;
}

export async function register(userData: any) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}

export async function fetchCurrentUser() {
  return fetchWithAuth('/me');
}

export async function fetchTransactions() {
  return fetchWithAuth('/transactions');
}

export async function createTransaction(transaction: any) {
  return fetchWithAuth('/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  });
}

export async function updateTransaction(id: string, transaction: any) {
  return fetchWithAuth(`/transactions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  });
}

export async function deleteTransaction(id: string) {
  return fetchWithAuth(`/transactions/${id}`, {
    method: 'DELETE'
  });
}