import React, { useState, useEffect } from 'react';
import { X, Check, Target, AlertCircle } from 'lucide-react';
import { formatMonthYear, formatCurrency } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLimit: number;
  selectedMonth: string; // YYYY-MM
  onSaveBudget: (limit: number) => Promise<void>;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentLimit,
  selectedMonth,
  onSaveBudget,
}) => {
  const [limit, setLimit] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLimit(currentLimit > 0 ? currentLimit.toString() : '');
      setError(null);
    }
  }, [isOpen, currentLimit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(limit);
    if (isNaN(num) || num < 0) {
      setError('กรุณากรอกงบประมาณที่ถูกต้อง');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSaveBudget(num);
      onClose();
    } catch (err: any) {
      console.error('Save budget error:', err);
      setError('ไม่สามารถบันทึกงบประมาณได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const QUICK_BUDGET_PRESETS = [5000, 10000, 15000, 20000, 30000, 50000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ตั้งเป้างบประมาณรายจ่าย
              </h3>
              <p className="text-xs text-slate-400">
                ประจำเดือน {formatMonthYear(selectedMonth)}
              </p>
            </div>
          </div>
          <button
            id="btn-close-budget-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              งบประมาณรายจ่ายสูงสุด (บาท ฿)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                ฿
              </span>
              <input
                id="input-budget-limit"
                type="number"
                min="0"
                step="100"
                placeholder="เช่น 20000"
                required
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="block text-xs font-medium text-slate-500 mb-1.5">
              เลือกตามงบยอดนิยม:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {QUICK_BUDGET_PRESETS.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setLimit(amt.toString())}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition ${
                    limit === amt.toString()
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ฿{formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              id="btn-save-budget"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกงบประมาณ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
