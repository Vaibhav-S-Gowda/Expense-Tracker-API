import type { Expense } from '../types';

interface Props {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#c0392b',
  Transport: '#7C2D3E',
  Shopping: '#a04030',
  Health: '#8B3A4A',
  Entertainment: '#6B2737',
  Utilities: '#5E1F2E',
  Travel: '#903040',
  Other: '#7C2D3E',
};

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? '#7C2D3E';
}

export function ExpenseCard({ expense, onEdit, onDelete }: Props) {
  const color = getCategoryColor(expense.category);

  return (
    <div className="expense-card" style={{ borderLeftColor: color }}>
      <div className="expense-card-top">
        <div className="expense-card-left">
          <span className="expense-category" style={{ backgroundColor: color + '1A', color }}>
            {expense.category}
          </span>
          <p className="expense-description">{expense.description || <span className="no-desc">No description</span>}</p>
        </div>
        <div className="expense-card-right">
          <span className="expense-amount">
            ₹{expense.amount.toLocaleString('en-IN')}
          </span>
          <span className="expense-date">{expense.date}</span>
        </div>
      </div>
      <div className="expense-card-actions">
        <button className="btn-card-action edit" onClick={() => onEdit(expense)}>
          Edit
        </button>
        <button className="btn-card-action delete" onClick={() => onDelete(expense)}>
          Delete
        </button>
      </div>
    </div>
  );
}
