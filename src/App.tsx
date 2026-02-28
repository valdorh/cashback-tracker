import React, { useState } from 'react';
import { Header } from './components/Header';
import { MonthSelector } from './components/MonthSelector';
import { Dashboard } from './components/Dashboard';
import { CardManager } from './components/CardManager';
import { CategoryManager } from './components/CategoryManager';
import { CashbackForm } from './components/CashbackForm';
import { SettingsModal } from './components/SettingsModal';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Card, Cashback, Category } from './types';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State for data
  const [cards, setCards] = useLocalStorage<Card[]>('cards', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', [
    { id: '1', name: 'Супермаркеты' },
    { id: '2', name: 'Аптеки' },
    { id: '3', name: 'Транспорт' },
    { id: '4', name: 'Рестораны' },
  ]);
  const [cashbacks, setCashbacks] = useLocalStorage<Cashback[]>('cashbacks', []);

  // State for modals
  const [isCardManagerOpen, setIsCardManagerOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCashbackFormOpen, setIsCashbackFormOpen] = useState(false);
  const [editingCashback, setEditingCashback] = useState<Cashback | null>(null);

  // Handlers for cards
  const handleAddCard = (card: Card) => setCards([...cards, card]);
  const handleEditCard = (updatedCard: Card) => {
    setCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c));
  };
  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    setCashbacks(cashbacks.filter(c => c.cardId !== id));
  };

  // Handlers for categories
  const handleAddCategory = (category: Category) => setCategories([...categories, category]);
  const handleEditCategory = (updatedCategory: Category) => {
    setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setCashbacks(cashbacks.filter(c => c.categoryId !== id));
  };

  // Handlers for cashbacks
  const handleSaveCashback = (cashback: Cashback) => {
    if (editingCashback) {
      setCashbacks(cashbacks.map(c => c.id === cashback.id ? cashback : c));
    } else {
      setCashbacks([...cashbacks, cashback]);
    }
  };
  const handleDeleteCashback = (id: string) => {
    setCashbacks(cashbacks.filter(c => c.id !== id));
  };

  // Handlers for import/export
  const handleImport = (importedCards: Card[], importedCategories: Category[], importedCashbacks: Cashback[]) => {
    setCards(importedCards);
    if (importedCategories.length > 0) {
      setCategories(importedCategories);
    }
    setCashbacks(importedCashbacks);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500 font-sans">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCardManager={() => setIsCardManagerOpen(true)}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <MonthSelector
          currentDate={currentDate}
          onChange={setCurrentDate}
        />

        <Dashboard
          cards={cards}
          categories={categories}
          cashbacks={cashbacks}
          selectedMonth={currentDate.getMonth()}
          selectedYear={currentDate.getFullYear()}
          onAddCashback={() => {
            setEditingCashback(null);
            setIsCashbackFormOpen(true);
          }}
          onEditCashback={(cashback) => {
            setEditingCashback(cashback);
            setIsCashbackFormOpen(true);
          }}
          onDeleteCashback={handleDeleteCashback}
        />
      </main>

      <CardManager
        isOpen={isCardManagerOpen}
        onClose={() => setIsCardManagerOpen(false)}
        cards={cards}
        onAddCard={handleAddCard}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
      />

      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <CashbackForm
        isOpen={isCashbackFormOpen}
        onClose={() => setIsCashbackFormOpen(false)}
        cards={cards}
        categories={categories}
        onSave={handleSaveCashback}
        initialData={editingCashback}
        selectedMonth={currentDate.getMonth()}
        selectedYear={currentDate.getFullYear()}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        cards={cards}
        categories={categories}
        cashbacks={cashbacks}
        onImport={handleImport}
      />
    </div>
  );
}
