import { useState, useCallback } from 'react';
import { expensesApi } from '../api/client';
import type { Expense, ExpensePayload } from '../types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expensesApi.list();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (payload: ExpensePayload) => {
    const expense = await expensesApi.create(payload);
    setExpenses((prev) => [expense, ...prev]);
    return expense;
  };

  const update = async (id: string, payload: ExpensePayload) => {
    const updated = await expensesApi.update(id, payload);
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const remove = async (id: string) => {
    await expensesApi.remove(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return { expenses, loading, error, fetchAll, create, update, remove };
}
