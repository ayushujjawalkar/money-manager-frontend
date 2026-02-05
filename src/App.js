import React, { useState, useEffect } from 'react';
import { Plus, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import TransactionModal from './components/TransactionModal';
import Filters from './components/Filters';
import { transactionAPI } from './services/api';
import { PERIOD_OPTIONS } from './utils/constants';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [period, setPeriod] = useState('month');
  const [filters, setFilters] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [filters, refreshTrigger]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionAPI.getAll(filters);
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (data) => {
    try {
      await transactionAPI.create(data);
      setSuccess('Transaction added successfully!');
      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUpdateTransaction = async (data) => {
    try {
      await transactionAPI.update(editingTransaction._id, data);
      setSuccess('Transaction updated successfully!');
      setIsModalOpen(false);
      setEditingTransaction(null);
      setRefreshTrigger(prev => prev + 1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update transaction';
      setError(errorMsg);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionAPI.delete(id);
      setSuccess('Transaction deleted successfully!');
      setRefreshTrigger(prev => prev + 1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete transaction';
      setError(errorMsg);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <span className="text-3xl">💰</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Money Manager</h1>
                <p className="text-primary-100 text-sm">Manage your finances with ease</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeView === 'dashboard'
                    ? 'bg-white text-primary-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('history')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeView === 'history'
                    ? 'bg-white text-primary-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                History
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-2 space-y-2">
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition text-left ${
                  activeView === 'dashboard'
                    ? 'bg-white text-primary-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveView('history');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition text-left ${
                  activeView === 'history'
                    ? 'bg-white text-primary-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                History
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 text-danger-700 px-6 py-4 rounded-lg flex items-center gap-3 animate-slide-in">
            <span className="text-2xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-success-50 border border-success-200 text-success-700 px-6 py-4 rounded-lg flex items-center gap-3 animate-slide-in">
            <span className="text-2xl">✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Period Selector (for Dashboard) */}
        {activeView === 'dashboard' && (
          <div className="mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                View Period
              </label>
              <div className="flex gap-3">
                {PERIOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPeriod(option.value)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                      period === option.value
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {activeView === 'history' && (
          <div className="mb-6">
            <Filters onFilterChange={handleFilterChange} onClear={handleClearFilters} />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : activeView === 'dashboard' ? (
          <Dashboard period={period} filters={filters} refreshTrigger={refreshTrigger} />
        ) : (
          <TransactionHistory
            transactions={transactions}
            onEdit={handleEditClick}
            onDelete={handleDeleteTransaction}
          />
        )}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-primary-600 text-white p-4 rounded-full shadow-2xl hover:bg-primary-700 transition transform hover:scale-110 z-50"
        title="Add Transaction"
      >
        <Plus size={32} />
      </button>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
        transaction={editingTransaction}
        mode={editingTransaction ? 'edit' : 'create'}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>© 2024 Money Manager. Built with React & Node.js</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
