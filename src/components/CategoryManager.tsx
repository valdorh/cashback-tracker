import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit2, Tags } from 'lucide-react';
import { Modal } from './Modal';
import type { Category } from '../types';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoryManager({ isOpen, onClose, categories, onAddCategory, onEditCategory, onDeleteCategory }: CategoryManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');

  const resetForm = () => {
    setName('');
    setEditingId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onEditCategory({ id: editingId, name: name.trim() });
    } else {
      onAddCategory({ id: uuidv4(), name: name.trim() });
    }
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Управление категориями">
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Название категории
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, Супермаркеты"
            className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
            {editingId ? 'Сохранить' : 'Добавить категорию'}
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
          Мои категории ({categories.length})
        </h3>
        {categories.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
            У вас пока нет добавленных категорий
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400">
                    <Tags size={16} />
                  </div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {category.name}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Удалить категорию? Это также удалит все кэшбэки с этой категорией.')) {
                        onDeleteCategory(category.id);
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
