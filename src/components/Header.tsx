import React from 'react';
import { Moon, Sun, Settings, CreditCard, Tags } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenCardManager: () => void;
  onOpenCategoryManager: () => void;
}

export function Header({ theme, toggleTheme, onOpenSettings, onOpenCardManager, onOpenCategoryManager }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-zinc-900/10 dark:border-zinc-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 border-b border-zinc-900/10 lg:border-0 dark:border-zinc-300/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-2 rounded-xl text-white">
              <CreditCard size={24} />
            </div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Cashback Tracker
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCategoryManager}
              className="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <Tags size={18} />
              <span className="hidden sm:inline">Категории</span>
            </button>
            <button
              onClick={onOpenCardManager}
              className="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <CreditCard size={18} />
              <span className="hidden sm:inline">Мои карты</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
