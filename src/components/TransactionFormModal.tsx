import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Calendar,
  DollarSign,
  Tag,
  CreditCard,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  Transaction,
  TransactionType,
  CATEGORIES,
  PAYMENT_METHODS,
} from '../types';
import { getTodayDateString } from '../utils/formatters';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: TransactionType;
    amount: number;
    category: string;
    date: string;
    note: string;
    paymentMethod: string;
  }) => Promise<void>;
  initialData?: Transaction | null;
  selectedMonth: string; // YYYY-MM
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  selectedMonth,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('โอนเงิน/QR PromptPay');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Available categories based on active type
  const availableCategories = CATEGORIES.filter((c) => c.type === type);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setNote(initialData.note || '');
      setPaymentMethod(initialData.paymentMethod || 'โอนเงิน/QR PromptPay');
    } else {
      // Default to today if within selected month, else 1st of selected month
      const today = getTodayDateString();
      if (today.startsWith(selectedMonth)) {
        setDate(today);
      } else {
        setDate(`${selectedMonth}-01`);
      }
      setType('expense');
      setAmount('');
      const defaultExpCat = CATEGORIES.find((c) => c.type === 'expense');
      setCategory(defaultExpCat?.name || '');
      setNote('');
      setPaymentMethod('โอนเงิน/QR PromptPay');
    }
    setError(null);
  }, [initialData, isOpen, selectedMonth]);

  // When type changes, adjust category if current category isn't matching
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const firstMatching = CATEGORIES.find((c) => c.type === newType);
    if (firstMatching) {
      setCategory(firstMatching.name);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('กรุณาระบุจำนวนเงินที่ถูกต้อง (มากกว่า 0)');
      return;
    }

    if (!category.trim()) {
      setError('กรุณาเลือกหมวดหมู่');
      return;
    }

    if (!date) {
      setError('กรุณาระบุวันที่ทำรายการ');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        type,
        amount: numAmount,
        category,
        date,
        note: note.trim(),
        paymentMethod,
      });
      onClose();
    } catch (err: any) {
      console.error('Submit transaction error:', err);
      setError('ไม่สามารถบันทึกรายการได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {initialData ? 'แก้ไขรายการ' : 'บันทึกรายการใหม่'}
            </h3>
            <p className="text-xs text-slate-400">
              บันทึกข้อมูลลงในระบบ MoneyDB (Firebase)
            </p>
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Type Toggle: Expense vs Income */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ประเภทรายการ
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                id="btn-type-expense"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 text-xs font-semibold rounded-xl transition ${
                  type === 'expense'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                รายจ่าย (Expense)
              </button>
              <button
                type="button"
                id="btn-type-income"
                onClick={() => handleTypeChange('income')}
                className={`py-2 text-xs font-semibold rounded-xl transition ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                รายรับ (Income)
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              จำนวนเงิน (บาท ฿) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                ฿
              </span>
              <input
                id="input-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              หมวดหมู่ <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
              {availableCategories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.name)}
                  className={`p-2 rounded-lg text-left text-xs flex flex-col justify-between border transition ${
                    category === cat.name
                      ? 'bg-white border-emerald-500 text-slate-900 font-semibold shadow-xs ring-1 ring-emerald-500'
                      : 'border-transparent text-slate-600 hover:bg-white/80'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mb-1"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                วันที่ทำรายการ <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ช่องทางการชำระ
              </label>
              <select
                id="select-payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.id} value={method.name}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Note / Memo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              บันทึกช่วยจำ (ถ้ามี)
            </label>
            <input
              id="input-note"
              type="text"
              maxLength={200}
              placeholder="เช่น ข้าวกลางวัน, กาแฟ, ค่าเดินทาง grab..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              id="btn-submit-transaction"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-sm transition ${
                type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกรายการ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
