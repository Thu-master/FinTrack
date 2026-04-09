import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../utils/firebase';

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

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
  categories: Category[];
}

interface TransactionContextType extends TransactionState {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  user: User | null;
  authLoading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        setTransactions([]);
        setCategories([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, 'users', user.uid, 'transactions'),
      orderBy('date', 'desc')
    );
    
    // Lắng nghe thay đổi realtime từ Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        txs.push({ id: docSnap.id, ...docSnap.data() } as Transaction);
      });
      setTransactions(txs);
    }, (error) => {
      console.error("Lỗi đồng bộ Giao dịch Firebase:", error);
    });

    // Lắng nghe thay đổi danh mục
    const qCat = query(collection(db, 'users', user.uid, 'categories'));
    const unsubscribeCat = onSnapshot(qCat, (snapshot) => {
      const cats: Category[] = [];
      snapshot.forEach((docSnap) => {
        cats.push({ id: docSnap.id, ...docSnap.data() } as Category);
      });
      // Nếu chưa có category, có thể chèn category mặc định ở component khác hoặc init tại đây
      setCategories(cats);
    }, (error) => {
      console.error("Lỗi đồng bộ Danh mục Firebase:", error);
    });

    return () => {
      unsubscribe();
      unsubscribeCat();
    };
  }, [user]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) {
      console.warn("Người dùng chưa đăng nhập, không thể lưu.");
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'transactions'), {
        ...transaction,
      });
    } catch (e) {
      console.error("Lỗi khi thêm giao dịch: ", e);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
    } catch (e) {
      console.error("Lỗi khi xoá giao dịch: ", e);
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'transactions', id), transaction);
    } catch (e) {
      console.error("Lỗi cập nhật: ", e);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'categories'), { ...category });
    } catch (e) {
      console.error("Lỗi tạo danh mục: ", e);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'categories', id));
    } catch (e) {
      console.error("Lỗi xóa danh mục: ", e);
    }
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      totalBalance,
      totalIncome,
      totalExpense,
      categories,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      addCategory,
      deleteCategory,
      user,
      authLoading
    }}>
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
