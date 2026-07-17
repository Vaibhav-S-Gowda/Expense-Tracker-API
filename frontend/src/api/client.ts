import type { AuthResponse, Expense, ExpensePayload } from '../types';

const BASE_URL = 'http://localhost:3000/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error ?? 'Request failed');
  }

  return res.json() as Promise<T>;
}

// Auth
export const authApi = {
  register: (email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Expenses
export const expensesApi = {
  list: () => request<Expense[]>('/expenses'),

  create: (payload: ExpensePayload) =>
    request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: ExpensePayload) =>
    request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    request<Expense>(`/expenses/${id}`, { method: 'DELETE' }),
};
