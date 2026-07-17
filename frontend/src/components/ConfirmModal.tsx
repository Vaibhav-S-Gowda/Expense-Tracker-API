import React from 'react';
import type { Expense } from '../types';

interface Props {
  expense: Expense;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function ConfirmModal({ expense, onConfirm, onClose }: Props) {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Delete Expense</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="confirm-text">
          Are you sure you want to delete the <strong>{expense.category}</strong> expense
          of <strong>₹{expense.amount.toLocaleString('en-IN')}</strong>? This action cannot
          be undone.
        </p>
        <div className="form-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
