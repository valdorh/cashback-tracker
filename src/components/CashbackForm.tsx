import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from './Modal';
import type { Card, Cashback, Category } from '../types';

interface CashbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Card[];
  categories: Category[];
  onSave: (cashback: Cashback) => void;
  initialData?: Cashback | null;
  selectedMonth: number;
  selectedYear: number;
}

export function CashbackForm({
  isOpen,
  onClose,
  cards,
  categories,
  onSave,
  initialData,
  selectedMonth,
  selectedYear,
}: CashbackFormProps) {
  const [formData, setFormData] = useState({
    cardId: '',
    categoryId: '',
    percent: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        cardId: initialData.cardId,
        categoryId: initialData.categoryId || '',
        percent: initialData.percent.toString(),
      });
    } else {
      setFormData({
        cardId: cards.length > 0 ? cards[0].id : '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        percent: '',
      });
    }
  }, [initialData, cards, categories, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cardId || !formData.categoryId || !formData.percent) return;

    onSave({
      id: initialData ? initialData.id : uuidv4(),
      cardId: formData.cardId,
      categoryId: formData.categoryId,
      month: selectedMonth,
      year: selectedYear,
      percent: parseFloat(formData.percent),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Редактировать кэшбэк' : 'Добавить кэшбэк'}
    >
      {cards.length === 0 || categories.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">
            Сначала добавьте хотя бы одну карту и категорию
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Понятно
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Карта
            </label>
            <select
              required
              value={formData.cardId}
              onChange={(e) => setFormData({ ...formData, cardId: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-zinc-100"
            >
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.bankName} - {card.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Категория
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-zinc-100"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Процент (%)
            </label>
            <input
              type="number"
              required
              min="0.1"
              max="100"
              step="0.1"
              value={formData.percent}
              onChange={(e) => setFormData({ ...formData, percent: e.target.value })}
              placeholder="5"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium"
            >
              Сохранить
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
