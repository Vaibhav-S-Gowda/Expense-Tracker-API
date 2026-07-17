import { useEffect, useState, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { StatsRow } from '../components/StatsRow';
import { ExpenseCard } from '../components/ExpenseCard';
import { ExpenseForm } from '../components/ExpenseForm';
import { ConfirmModal } from '../components/ConfirmModal';
import { useExpenses } from '../hooks/useExpenses';
import type { Expense, ExpensePayload } from '../types';

type SortKey = 'date' | 'amount' | 'category';

export function DashboardPage() {
  const { expenses, loading, error, fetchAll, create, update, remove } = useExpenses();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const categories = useMemo(() => {
    const cats = new Set(expenses.map((e) => e.category));
    return ['All', ...Array.from(cats).sort()];
  }, [expenses]);

  const filtered = useMemo(() => {
    return expenses
      .filter((e: Expense) => {
        const matchCat = categoryFilter === 'All' || e.category === categoryFilter;
        const matchSearch =
          !search ||
          e.description.toLowerCase().includes(search.toLowerCase()) ||
          e.category.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      })
      .sort((a: Expense, b: Expense) => {
        let cmp = 0;
        if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
        if (sortKey === 'amount') cmp = a.amount - b.amount;
        if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [expenses, search, categoryFilter, sortKey, sortDir]);

  const handleEdit = (expense: Expense) => {
    setEditTarget(expense);
    setShowForm(true);
  };

  const handleFormSubmit = async (payload: ExpensePayload) => {
    if (editTarget) {
      await update(editTarget.id, payload);
    } else {
      await create(payload);
    }
    setShowForm(false);
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    setDeleteTarget(null);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        <StatsRow expenses={expenses} />

        <div className="dashboard-toolbar">
          <input
            className="form-input search-input"
            type="search"
            placeholder="Search by description or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="toolbar-right">
            <select
              className="form-input form-select filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((c: string) => <option key={c}>{c}</option>)}
            </select>

            <div className="sort-group">
              {(['date', 'amount', 'category'] as SortKey[]).map((key: SortKey) => (
                <button
                  key={key}
                  className={`sort-btn ${sortKey === key ? 'active' : ''}`}
                  onClick={() => toggleSort(key)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortKey === key && (
                    <span className="sort-arrow">{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </button>
              ))}
            </div>

            <button className="btn-primary" onClick={() => { setEditTarget(null); setShowForm(true); }}>
              + Add Expense
            </button>
          </div>
        </div>

        {loading && <p className="state-msg">Loading expenses…</p>}
        {error && <p className="state-msg state-error">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <p className="empty-title">No expenses found</p>
            <p className="empty-sub">
              {expenses.length === 0
                ? 'Add your first expense to get started.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        )}

        <div className="expense-list">
          {filtered.map((expense: Expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      </main>

      {showForm && (
        <ExpenseForm
          initial={editTarget}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          expense={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
