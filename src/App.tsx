/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import {
  db,
  testConnection,
  handleFirestoreError,
  OperationType,
} from './lib/firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { MonthlySummaryCards } from './components/MonthlySummaryCards';
import { GraphicsAnalytics } from './components/GraphicsAnalytics';
import { TransactionList } from './components/TransactionList';
import { TransactionFormModal } from './components/TransactionFormModal';
import { BudgetModal } from './components/BudgetModal';
import { LoginPrompt } from './components/LoginPrompt';
import { Transaction, TransactionType, Budget } from './types';
import { getCurrentMonthString, formatMonthYear } from './utils/formatters';
import { Sparkles, Loader2, Database } from 'lucide-react';

const MainDashboard: React.FC = () => {
  const { user, isGuest, loading: authLoading } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthString());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [monthlyLimit, setMonthlyLimit] = useState<number>(0);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);

  // Helper for guest storage keys
  const GUEST_TX_KEY = 'moneydb_guest_transactions';
  const getGuestBudgetKey = (month: string) => `moneydb_guest_budget_${month}`;

  // 1. Listen for user transactions (Firestore or LocalStorage for Guest)
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoadingData(false);
      return;
    }

    if (isGuest) {
      setLoadingData(true);
      const stored = localStorage.getItem(GUEST_TX_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTransactions(parsed);
        } catch {
          setTransactions([]);
        }
      } else {
        // Seed default sample data for guest preview
        const initialSample: Transaction[] = [
          {
            id: 'sample-1',
            userId: user.uid,
            type: 'income',
            amount: 45000,
            category: 'เงินเดือน/โบนัส',
            date: `${selectedMonth}-01`,
            note: 'เงินเดือนประจำเดือน',
            paymentMethod: 'โอนเงิน/QR PromptPay',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'sample-2',
            userId: user.uid,
            type: 'expense',
            amount: 8500,
            category: 'ค่าที่พัก/ค่าน้ำค่าไฟ',
            date: `${selectedMonth}-03`,
            note: 'ค่าเช่าและค่าน้ำค่าไฟ',
            paymentMethod: 'โอนเงิน/QR PromptPay',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'sample-3',
            userId: user.uid,
            type: 'expense',
            amount: 3200,
            category: 'อาหารและเครื่องดื่ม',
            date: `${selectedMonth}-05`,
            note: 'ซื้อของสดและอาหารเข้าบ้าน',
            paymentMethod: 'โอนเงิน/QR PromptPay',
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(GUEST_TX_KEY, JSON.stringify(initialSample));
        setTransactions(initialSample);
      }
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    const transactionsPath = 'transactions';
    const q = query(
      collection(db, transactionsPath),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Transaction[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            userId: data.userId,
            type: data.type,
            amount: Number(data.amount) || 0,
            category: data.category || 'อื่นๆ',
            date: data.date || '',
            note: data.note || '',
            paymentMethod: data.paymentMethod || 'โอนเงิน/QR PromptPay',
            createdAt: data.createdAt || '',
          });
        });
        setTransactions(items);
        setLoadingData(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, transactionsPath);
        setLoadingData(false);
      }
    );

    return () => unsubscribe();
  }, [user, isGuest, selectedMonth]);

  // 2. Fetch monthly budget for selected month
  useEffect(() => {
    if (!user) {
      setMonthlyLimit(0);
      return;
    }

    if (isGuest) {
      const storedBudget = localStorage.getItem(getGuestBudgetKey(selectedMonth));
      if (storedBudget) {
        setMonthlyLimit(Number(storedBudget) || 0);
      } else {
        setMonthlyLimit(20000);
      }
      return;
    }

    const budgetDocId = `${user.uid}_${selectedMonth}`;
    const budgetPath = `budgets/${budgetDocId}`;

    const unsubscribe = onSnapshot(
      doc(db, 'budgets', budgetDocId),
      (docSnap) => {
        if (docSnap.exists()) {
          setMonthlyLimit(Number(docSnap.data().monthlyLimit) || 0);
        } else {
          setMonthlyLimit(0);
        }
      },
      (error) => {
        console.warn('Budget fetch note:', error);
      }
    );

    return () => unsubscribe();
  }, [user, isGuest, selectedMonth]);

  // Transactions filtered by selected month
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date && t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Monthly aggregates
  const totalIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const totalExpense = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  // Transaction mutation handlers
  const handleCreateOrUpdateTransaction = async (data: {
    type: TransactionType;
    amount: number;
    category: string;
    date: string;
    note: string;
    paymentMethod: string;
  }) => {
    if (!user) return;

    if (isGuest) {
      if (editingTransaction) {
        const updatedList = transactions.map((t) =>
          t.id === editingTransaction.id
            ? { ...t, ...data }
            : t
        );
        setTransactions(updatedList);
        localStorage.setItem(GUEST_TX_KEY, JSON.stringify(updatedList));
      } else {
        const newTx: Transaction = {
          id: `guest_tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          userId: user.uid,
          type: data.type,
          amount: data.amount,
          category: data.category,
          date: data.date,
          note: data.note,
          paymentMethod: data.paymentMethod,
          createdAt: new Date().toISOString(),
        };
        const updatedList = [newTx, ...transactions];
        setTransactions(updatedList);
        localStorage.setItem(GUEST_TX_KEY, JSON.stringify(updatedList));
      }
      return;
    }

    const path = 'transactions';
    try {
      if (editingTransaction) {
        const docRef = doc(db, path, editingTransaction.id);
        await updateDoc(docRef, {
          type: data.type,
          amount: data.amount,
          category: data.category,
          date: data.date,
          note: data.note,
          paymentMethod: data.paymentMethod,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await addDoc(collection(db, path), {
          userId: user.uid,
          type: data.type,
          amount: data.amount,
          category: data.category,
          date: data.date,
          note: data.note,
          paymentMethod: data.paymentMethod,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      handleFirestoreError(
        err,
        editingTransaction ? OperationType.UPDATE : OperationType.CREATE,
        path
      );
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (isGuest) {
      const updatedList = transactions.filter((t) => t.id !== id);
      setTransactions(updatedList);
      localStorage.setItem(GUEST_TX_KEY, JSON.stringify(updatedList));
      return;
    }

    const path = `transactions/${id}`;
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleSaveBudget = async (limit: number) => {
    if (!user) return;

    if (isGuest) {
      setMonthlyLimit(limit);
      localStorage.setItem(getGuestBudgetKey(selectedMonth), limit.toString());
      return;
    }

    const budgetDocId = `${user.uid}_${selectedMonth}`;
    const path = `budgets/${budgetDocId}`;
    try {
      await setDoc(
        doc(db, 'budgets', budgetDocId),
        {
          userId: user.uid,
          month: selectedMonth,
          monthlyLimit: limit,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  // Seed sample initial transactions for quick testing
  const handleSeedSampleData = async () => {
    if (!user) return;
    const sampleItems = [
      {
        type: 'income' as TransactionType,
        amount: 45000,
        category: 'เงินเดือน/โบนัส',
        date: `${selectedMonth}-01`,
        note: 'เงินเดือนประจำเดือน',
        paymentMethod: 'โอนเงิน/QR PromptPay',
      },
      {
        type: 'expense' as TransactionType,
        amount: 8500,
        category: 'ค่าที่พัก/ค่าน้ำค่าไฟ',
        date: `${selectedMonth}-03`,
        note: 'ค่าเช่าห้องและค่าน้ำค่าไฟ',
        paymentMethod: 'โอนเงิน/QR PromptPay',
      },
      {
        type: 'expense' as TransactionType,
        amount: 320,
        category: 'อาหารและเครื่องดื่ม',
        date: `${selectedMonth}-04`,
        note: 'อาหารกลางวัน + ชาเขียว',
        paymentMethod: 'สแกน QR',
      },
      {
        type: 'expense' as TransactionType,
        amount: 1450,
        category: 'ช้อปปิ้ง/ของใช้',
        date: `${selectedMonth}-05`,
        note: 'ของใช้ในบ้านซูเปอร์มาร์เก็ต',
        paymentMethod: 'บัตรเครดิต/เดบิต',
      },
      {
        type: 'expense' as TransactionType,
        amount: 650,
        category: 'การเดินทาง/น้ำมัน',
        date: `${selectedMonth}-06`,
        note: 'เติมน้ำมันรถ',
        paymentMethod: 'บัตรเครดิต/เดบิต',
      },
      {
        type: 'income' as TransactionType,
        amount: 5000,
        category: 'ธุรกิจ/ฟรีแลนซ์/งานเสริม',
        date: `${selectedMonth}-07`,
        note: 'รับงานออกแบบกราฟิก',
        paymentMethod: 'โอนเงิน/QR PromptPay',
      },
    ];

    if (isGuest) {
      const generated: Transaction[] = sampleItems.map((item, idx) => ({
        id: `guest_tx_seed_${Date.now()}_${idx}`,
        userId: user.uid,
        type: item.type,
        amount: item.amount,
        category: item.category,
        date: item.date,
        note: item.note,
        paymentMethod: item.paymentMethod,
        createdAt: new Date().toISOString(),
      }));
      const updated = [...generated, ...transactions];
      setTransactions(updated);
      localStorage.setItem(GUEST_TX_KEY, JSON.stringify(updated));
      if (monthlyLimit === 0) {
        setMonthlyLimit(25000);
        localStorage.setItem(getGuestBudgetKey(selectedMonth), '25000');
      }
      return;
    }

    try {
      for (const item of sampleItems) {
        await addDoc(collection(db, 'transactions'), {
          ...item,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
      }
      // Also set default budget if not set
      if (monthlyLimit === 0) {
        await handleSaveBudget(25000);
      }
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs text-slate-500 mt-3 font-medium">กำลังเตรียมความพร้อมระบบ MoneyDB...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navigation */}
      <Navbar
        selectedMonth={selectedMonth}
        onMonthChange={(m) => setSelectedMonth(m)}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {!user ? (
          <LoginPrompt />
        ) : (
          <div className="space-y-6">
            {/* Quick Helper Banner for First-Time Empty State */}
            {currentMonthTransactions.length === 0 && !loadingData && (
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-emerald-900">
                      เริ่มต้นบันทึกรายรับรายจ่ายประจำเดือน {formatMonthYear(selectedMonth)}
                    </h3>
                    <p className="text-[11px] text-emerald-700">
                      คุณสามารถกดปุ่ม "บันทึกรายการ" หรือโหลดชุดข้อมูลตัวอย่างเพื่อดูกราฟฟิควิเคราะห์ทันที
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSeedSampleData}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-300 shadow-2xs transition"
                  >
                    ใส่ข้อมูลตัวอย่างทดสอบ
                  </button>
                  <button
                    onClick={() => {
                      setEditingTransaction(null);
                      setIsAddModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                  >
                    + บันทึกรายการใหม่
                  </button>
                </div>
              </div>
            )}

            {/* Monthly Summary Statistics Cards */}
            <MonthlySummaryCards
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              monthlyLimit={monthlyLimit}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />

            {/* Graphics & Charts Analysis */}
            <GraphicsAnalytics
              transactions={currentMonthTransactions}
              selectedMonth={selectedMonth}
            />

            {/* Transactions History & Filter List */}
            <TransactionList
              transactions={currentMonthTransactions}
              selectedMonth={selectedMonth}
              onEdit={(tx) => {
                setEditingTransaction(tx);
                setIsAddModalOpen(true);
              }}
              onDelete={handleDeleteTransaction}
              onOpenAddModal={() => {
                setEditingTransaction(null);
                setIsAddModalOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Add / Edit Transaction Modal */}
      <TransactionFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleCreateOrUpdateTransaction}
        initialData={editingTransaction}
        selectedMonth={selectedMonth}
      />

      {/* Set Monthly Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentLimit={monthlyLimit}
        selectedMonth={selectedMonth}
        onSaveBudget={handleSaveBudget}
      />
    </div>
  );
};

export default function App() {
  useEffect(() => {
    // Validate Firestore connection on boot per Firebase skill guidelines
    testConnection();
  }, []);

  return (
    <AuthProvider>
      <MainDashboard />
    </AuthProvider>
  );
}
