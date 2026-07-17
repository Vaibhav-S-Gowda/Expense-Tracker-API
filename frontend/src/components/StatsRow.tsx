import type { Expense } from '../types';

interface Props {
  expenses: Expense[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function getMonthlyTotal(expenses: Expense[]) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return expenses
    .filter((e: Expense) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

function getTopCategory(expenses: Expense[]) {
  if (!expenses.length) return '—';
  const counts: Record<string, number> = {};
  expenses.forEach((e: Expense) => {
    counts[e.category] = (counts[e.category] ?? 0) + e.amount;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export function StatsRow({ expenses }: Props) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const monthly = getMonthlyTotal(expenses);
  const categories = new Set(expenses.map((e) => e.category)).size;
  const topCategory = getTopCategory(expenses);

  const stats = [
    { label: 'Total Spent', value: formatCurrency(total), sub: `across ${expenses.length} entries` },
    { label: 'This Month', value: formatCurrency(monthly), sub: 'current month' },
    { label: 'Categories', value: String(categories), sub: `Top: ${topCategory}` },
  ];

  return (
    <div className="stats-row">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <span className="stat-label">{s.label}</span>
          <span className="stat-value">{s.value}</span>
          <span className="stat-sub">{s.sub}</span>
        </div>
      ))}
    </div>
  );
}
