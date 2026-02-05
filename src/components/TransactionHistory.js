import React, { useState } from 'react';
import { Edit2, Trash2, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDateTime, getCategoryIcon, getCategoryLabel } from '../utils/constants';

const TransactionHistory = ({ transactions, onEdit, onDelete }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = (transaction) => {
    setDeleteConfirm(transaction._id);
  };

  const confirmDelete = (transaction) => {
    onDelete(transaction._id);
    setDeleteConfirm(null);
  };

  const canEdit = (transaction) => {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const createdAt = new Date(transaction.createdAt);
    return createdAt > twelveHoursAgo;
  };

  const getTimeRemaining = (transaction) => {
    const createdAt = new Date(transaction.createdAt);
    const expiryTime = new Date(createdAt.getTime() + 12 * 60 * 60 * 1000);
    const now = new Date();
    const diff = expiryTime - now;

    if (diff <= 0) return 'Locked';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-gray-300 mb-4">
          <Wallet size={64} className="mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No transactions yet</h3>
        <p className="text-gray-400">Click the + button to add your first transaction</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Division
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => {
              const editable = canEdit(transaction);
              const isDeleting = deleteConfirm === transaction._id;

              return (
                <tr key={transaction._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDateTime(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(transaction.category)}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {getCategoryLabel(transaction.category)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.division === 'office'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {transaction.division === 'office' ? '🏢 Office' : '👤 Personal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-bold ${
                      transaction.type === 'income'
                        ? 'text-success-600'
                        : transaction.type === 'expense'
                        ? 'text-danger-600'
                        : 'text-primary-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {isDeleting ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => confirmDelete(transaction)}
                          className="px-3 py-1 bg-danger-600 text-white text-xs rounded hover:bg-danger-700 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : editable ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(transaction)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="Edit transaction"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction)}
                          className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition"
                          title="Delete transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="text-xs text-gray-500 flex items-center gap-1" title="Time remaining to edit">
                          <Clock size={12} />
                          {getTimeRemaining(transaction)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                        <AlertCircle size={14} />
                        <span>Locked</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Wallet = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

export default TransactionHistory;
