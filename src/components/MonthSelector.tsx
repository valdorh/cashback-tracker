import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

interface MonthSelectorProps {
  currentDate: Date;
  onChange: (date: Date) => void;
}

export function MonthSelector({ currentDate, onChange }: MonthSelectorProps) {
  const handlePrev = () => onChange(subMonths(currentDate, 1));
  const handleNext = () => onChange(addMonths(currentDate, 1));
  const handleCurrent = () => onChange(new Date());

  return (
    <div className="flex items-center justify-between w-full max-w-sm mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-2">
      <button
        onClick={handlePrev}
        className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <div className="flex flex-col items-center cursor-pointer" onClick={handleCurrent}>
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
          {format(currentDate, 'LLLL', { locale: ru })}
        </span>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {format(currentDate, 'yyyy')}
        </span>
      </div>
      <button
        onClick={handleNext}
        className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
