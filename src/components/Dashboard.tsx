import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
import type { Card, Cashback, Category } from '../types';

interface DashboardProps {
  cards: Card[];
  categories: Category[];
  cashbacks: Cashback[];
  selectedMonth: number;
  selectedYear: number;
  onAddCashback: () => void;
  onEditCashback: (cashback: Cashback) => void;
  onDeleteCashback: (id: string) => void;
}

export function Dashboard({
  cards,
  categories,
  cashbacks,
  selectedMonth,
  selectedYear,
  onAddCashback,
  onEditCashback,
  onDeleteCashback,
}: DashboardProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // Filter cashbacks for the selected month and year
  let filteredCashbacks = cashbacks.filter(
    (c) => c.month === selectedMonth && c.year === selectedYear
  );

  // Filter by category if one is selected
  if (selectedCategoryId !== 'all') {
    filteredCashbacks = filteredCashbacks.filter(
      (c) => c.categoryId === selectedCategoryId
    );
  }

  // Group cashbacks by card
  const cashbacksByCard = filteredCashbacks.reduce((acc, cashback) => {
    if (!acc[cashback.cardId]) {
      acc[cashback.cardId] = [];
    }
    acc[cashback.cardId].push(cashback);
    return acc;
  }, {} as Record<string, Cashback[]>);

  // Get cards that have cashbacks for this month
  const activeCards = cards.filter((card) => cashbacksByCard[card.id]?.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Категории кэшбэка
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-zinc-400" />
            </div>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full sm:w-48 pl-9 pr-8 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-zinc-900 dark:text-zinc-100 appearance-none"
            >
              <option value="all">Все категории</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onAddCashback}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium shadow-sm whitespace-nowrap"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Добавить кэшбэк</span>
          </button>
        </div>
      </div>

      {activeCards.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="text-zinc-400 dark:text-zinc-500" size={32} />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            {selectedCategoryId === 'all' ? 'Нет кэшбэка на этот месяц' : 'Нет кэшбэка в этой категории'}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            {selectedCategoryId === 'all' 
              ? 'Добавьте категории повышенного кэшбэка для ваших карт, чтобы начать отслеживание.'
              : 'В выбранном месяце нет карт с повышенным кэшбэком в этой категории.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCards.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col"
            >
              <div
                className="h-2 w-full"
                style={{ backgroundColor: card.color }}
              />
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                    style={{ backgroundColor: card.color }}
                  >
                    {card.bankName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                      {card.bankName}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {card.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  {cashbacksByCard[card.id].map((cashback) => (
                    <div
                      key={cashback.id}
                      className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {categories.find(c => c.id === cashback.categoryId)?.name || cashback.category || 'Неизвестная категория'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {cashback.percent}%
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditCashback(cashback)}
                            className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Удалить эту категорию?')) {
                                onDeleteCashback(cashback.id);
                              }
                            }}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
