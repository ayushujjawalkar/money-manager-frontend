import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { transactionAPI } from '../services/api';
import { formatCurrency } from '../utils/constants';

const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

const Dashboard = ({ period, filters, refreshTrigger }) => {
  const [summary, setSummary] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [period, filters, refreshTrigger]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        period: period,
      };

      const [summaryRes, categoryRes, monthlyRes] = await Promise.all([
        transactionAPI.getSummary(params),
        transactionAPI.getCategoryStats({ ...params, type: 'expense' }),
        transactionAPI.getMonthlyStats({ year: new Date().getFullYear() }),
      ]);

      setSummary(summaryRes.data);
      setCategoryStats(categoryRes.data);
      setMonthlyStats(monthlyRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = monthlyStats.map(stat => ({
    month: monthNames[stat._id - 1],
    income: stat.income || 0,
    expense: stat.expense || 0,
  }));

  const pieData = categoryStats.slice(0, 6).map(stat => ({
    name: stat._id,
    value: stat.totalAmount,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Income
            </span>
          </div>
          <div className="text-3xl font-bold mb-2">
            {formatCurrency(summary?.totalIncome || 0)}
          </div>
          <div className="text-success-100 text-sm">
            Total income received
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-gradient-to-br from-danger-500 to-danger-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Expense
            </span>
          </div>
          <div className="text-3xl font-bold mb-2">
            {formatCurrency(summary?.totalExpense || 0)}
          </div>
          <div className="text-danger-100 text-sm">
            Total amount spent
          </div>
        </div>

        {/* Balance */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Wallet size={24} />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Balance
            </span>
          </div>
          <div className="text-3xl font-bold mb-2">
            {formatCurrency(summary?.balance || 0)}
          </div>
          <div className="text-primary-100 text-sm">
            Current balance
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expense */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="text-primary-600" size={24} />
            <h3 className="text-lg font-bold text-gray-800">Monthly Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top Expense Categories</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No expense data available
            </div>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Expense Breakdown</h3>
        <div className="space-y-3">
          {categoryStats.length > 0 ? (
            categoryStats.map((stat, index) => (
              <div key={stat._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium text-gray-700 capitalize">
                    {stat._id.replace('-', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">({stat.count} transactions)</span>
                </div>
                <span className="font-bold text-gray-800">
                  {formatCurrency(stat.totalAmount)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
