import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { Modal } from './Modal';
import type { Card, Cashback, Category } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Card[];
  categories: Category[];
  cashbacks: Cashback[];
  onImport: (cards: Card[], categories: Category[], cashbacks: Cashback[]) => void;
}

export function SettingsModal({ isOpen, onClose, cards, categories, cashbacks, onImport }: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = { cards, categories, cashbacks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cashback-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data.cards) && Array.isArray(data.cashbacks)) {
          if (window.confirm('Это действие перезапишет все текущие данные. Продолжить?')) {
            onImport(data.cards, Array.isArray(data.categories) ? data.categories : [], data.cashbacks);
            onClose();
          }
        } else {
          alert('Неверный формат файла');
        }
      } catch (error) {
        alert('Ошибка при чтении файла');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Настройки">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Резервное копирование
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors font-medium"
            >
              <Download size={18} />
              Экспорт данных (JSON)
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors font-medium"
            >
              <Upload size={18} />
              Импорт данных (JSON)
            </button>
            <input
              type="file"
              accept=".json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImport}
            />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-2">
            Все данные хранятся локально в вашем браузере. Регулярно делайте экспорт, чтобы не потерять их.
          </p>
        </div>
      </div>
    </Modal>
  );
}
