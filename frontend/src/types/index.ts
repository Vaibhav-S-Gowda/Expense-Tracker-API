export interface User {
  id: string;
  email: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ExpensePayload {
  amount: number;
  category: string;
  description?: string;
  date?: string;
}

export type AuthMode = 'login' | 'register';
