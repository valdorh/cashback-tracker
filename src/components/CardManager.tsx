import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Modal } from './Modal';
import type { Card } from '../types';

interface CardManagerProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Card[];
  onAddCard: (card: Card) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (id: string) => void;
}

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899',
  '#18181b', '#52525b', '#e4e4e7'
];

export function CardManager({ isOpen, onClose, cards, onAddCard, onEditCard, onDeleteCard }: CardManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', bankName: '', color: COLORS[0] });

  const resetForm = () => {
    setFormData({ name: '', bankName: '', color: COLORS[0] });
    setEditingId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.bankName.trim()) return;

    if (editingId) {
      onEditCard({ id: editingId, ...formData });
    } else {
      onAddCard({ id: uuidv4(), ...formData });
    }
    resetForm();
  };

  const handleEdit = (card: Card) => {
    setEditingId(card.id);
    setFormData({ name: card.name, bankName: card.bankName, color: card.color });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Управление картами">
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Название банка
          </label>
          <input
            type="text"
            required
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            placeholder="Например, Т-Банк"
            className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Название карты
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Например, Black"
            className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Цвет карты
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  formData.color === color ? 'border-indigo-500 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
            {editingId ? 'Сохранить' : 'Добавить карту'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Мои карты ({cards.length})
        </h3>
        {cards.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
            У вас пока нет добавленных карт
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-8 rounded-full"
                    style={{ backgroundColor: card.color }}
                  />
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-tight">
                      {card.bankName}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {card.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(card)}
                    className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Удалить карту и все связанные кэшбэки?')) {
                        onDeleteCard(card.id);
                      }
                    }}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
