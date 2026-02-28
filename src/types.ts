export interface Card {
  id: string;
  name: string;
  bankName: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Cashback {
  id: string;
  cardId: string;
  categoryId: string;
  category?: string; // For backward compatibility
  month: number;
  year: number;
  percent: number;
}
