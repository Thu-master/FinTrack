import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

interface TransactionState {
  transactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

type TransactionAction = 
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string };

const initialState: TransactionState = {
  transactions: [
    { id: '1', title: 'Lương tháng 4', amount: 15000000, type: 'income', category: 'Lương', date: new Date().toISOString() },
    { id: '2', title: 'Tiền nhà', amount: 5000000, type: 'expense', category: 'Nhà ở', date: new Date().toISOString() },
    { id: '3', title: 'Ăn tối', amount: 200000, type: 'expense', category: 'Ăn uống', date: new Date().toISOString() },
    { id: '4', title: 'Thưởng KPI', amount: 2000000, type: 'income', category: 'Thưởng', date: new Date().toISOString() },
    { id: '5', title: 'Đổ xăng', amount: 100000, type: 'expense', category: 'Di chuyển', date: new Date().toISOString() },
  ],
  totalBalance: 0,
  totalIncome: 0,
  totalExpense: 0,
};

// Helper to calculate totals
const calculateTotals = (transactions: Transaction[]) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalIncome: income,
    totalExpense: expense,
    totalBalance: income - expense,
  };
};

const transactionReducer = (state: TransactionState, action: TransactionAction): TransactionState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      const updatedTransactions = [action.payload, ...state.transactions];
      return {
        ...state,
        transactions: updatedTransactions,
        ...calculateTotals(updatedTransactions),
      };
    case 'DELETE_TRANSACTION':
      const filteredTransactions = state.transactions.filter(t => t.id !== action.payload);
      return {
        ...state,
        transactions: filteredTransactions,
        ...calculateTotals(filteredTransactions),
      };
    default:
      return state;
  }
};

interface TransactionContextType extends TransactionState {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, {
    ...initialState,
    ...calculateTotals(initialState.transactions),
  });

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  return (
    <TransactionContext.Provider value={{ ...state, addTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
