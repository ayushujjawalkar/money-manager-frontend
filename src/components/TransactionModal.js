import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, DIVISIONS, ACCOUNTS } from '../utils/constants';

const TransactionModal = ({ isOpen, onClose, onSubmit, transaction, mode = 'create' }) => {
  const [activeTab, setActiveTab] = useState('income');
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    category: '',
    division: 'personal',
    description: '',
    date: new Date().toISOString().slice(0, 16),
    account: 'main',
    transferTo: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction && mode === 'edit') {
      setFormData({
        ...transaction,
        date: new Date(transaction.date).toISOString().slice(0, 16),
      });
      setActiveTab(transaction.type);
    } else {
      setFormData({
        type: 'income',
        amount: '',
        category: '',
        division: 'personal',
        description: '',
        date: new Date().toISOString().slice(0, 16),
        account: 'main',
        transferTo: '',
      });
      setActiveTab('income');
    }
    setErrors({});
  }, [transaction, mode, isOpen]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ ...formData, type: tab, category: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.type === 'transfer' && !formData.transferTo) {
      newErrors.transferTo = 'Please select transfer destination';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  const categories = activeTab === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange('income')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'income'
                ? 'text-success-600 border-b-2 border-success-600 bg-success-50'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => handleTabChange('expense')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'expense'
                ? 'text-danger-600 border-b-2 border-danger-600 bg-danger-50'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => handleTabChange('transfer')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'transfer'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Transfer
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-5">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  errors.amount ? 'border-danger-500' : 'border-gray-300'
                }`}
              />
              {errors.amount && (
                <p className="text-danger-600 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-3 rounded-lg border-2 transition text-center ${
                      formData.category === cat.value
                        ? activeTab === 'income'
                          ? 'border-success-500 bg-success-50'
                          : 'border-danger-500 bg-danger-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{cat.label}</div>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-danger-600 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Division */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Division *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {DIVISIONS.map((div) => (
                  <button
                    key={div.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, division: div.value })}
                    className={`p-4 rounded-lg border-2 transition flex items-center justify-center gap-2 ${
                      formData.division === div.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{div.icon}</span>
                    <span className="font-medium text-gray-700">{div.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account *
              </label>
              <select
                name="account"
                value={formData.account}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              >
                {ACCOUNTS.map((acc) => (
                  <option key={acc.value} value={acc.value}>
                    {acc.icon} {acc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Transfer To (only for transfer type) */}
            {activeTab === 'transfer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer To *
                </label>
                <select
                  name="transferTo"
                  value={formData.transferTo}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.transferTo ? 'border-danger-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select account</option>
                  {ACCOUNTS.filter(acc => acc.value !== formData.account).map((acc) => (
                    <option key={acc.value} value={acc.value}>
                      {acc.icon} {acc.label}
                    </option>
                  ))}
                </select>
                {errors.transferTo && (
                  <p className="text-danger-600 text-sm mt-1">{errors.transferTo}</p>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter transaction details..."
                rows="3"
                maxLength="500"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none ${
                  errors.description ? 'border-danger-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && (
                  <p className="text-danger-600 text-sm">{errors.description}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.description.length}/500
                </p>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition shadow-md"
            >
              {mode === 'edit' ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;


