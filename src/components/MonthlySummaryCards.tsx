import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Edit2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface MonthlySummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  monthlyLimit: number;
  onOpenBudgetModal: () => void;
}

export const MonthlySummaryCards: React.FC<MonthlySummaryCardsProps> = ({
  totalIncome,
  totalExpense,
  monthlyLimit,
  onOpenBudgetModal,
}) => {
  const netBalance = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0 ? Math.max(0, Math.round((netBalance / totalIncome) * 100)) : 0;

  const budgetUsedPercent =
    monthlyLimit > 0 ? Math.round((totalExpense / monthlyLimit) * 100) : 0;
  const isOverBudget = monthlyLimit > 0 && totalExpense > monthlyLimit;
  const remainingBudget = monthlyLimit > 0 ? monthlyLimit - totalExpense : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Income Card */}
      <div
        id="card-total-income"
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            รายรับรวมประจำเดือน
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-semibold text-emerald-600">฿</span>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatCurrency(totalIncome)}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          เงินเข้าบัญชีทั้งหมดในเดือนนี้
        </div>
      </div>

      {/* 2. Total Expense Card */}
      <div
        id="card-total-expense"
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            รายจ่ายรวมประจำเดือน
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-semibold text-rose-600">฿</span>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatCurrency(totalExpense)}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          ยอดเงินที่ใช้จ่ายไปทั้งหมด
        </div>
      </div>

      {/* 3. Net Balance Card */}
      <div
        id="card-net-balance"
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            ยอดคงเหลือสุทธิ
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              netBalance >= 0
                ? 'bg-teal-50 text-teal-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xs font-semibold ${
              netBalance >= 0 ? 'text-teal-600' : 'text-rose-600'
            }`}
          >
            ฿
          </span>
          <span
            className={`text-2xl font-bold tracking-tight ${
              netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'
            }`}
          >
            {formatCurrency(netBalance)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <PiggyBank className="w-3.5 h-3.5 text-teal-500" />
          <span>อัตราการออม {savingsRate}%</span>
        </div>
      </div>

      {/* 4. Budget & Limit Card */}
      <div
        id="card-budget-status"
        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              งบประมาณรายจ่าย
            </span>
            <button
              id="btn-edit-budget"
              onClick={onOpenBudgetModal}
              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              title="ตั้งงบประมาณ"
            >
              <Edit2 className="w-3 h-3" />
              <span>{monthlyLimit > 0 ? 'ปรับงบ' : 'ตั้งงบ'}</span>
            </button>
          </div>

          {monthlyLimit > 0 ? (
            <>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-900">
                  ฿{formatCurrency(totalExpense)}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    / ฿{formatCurrency(monthlyLimit)}
                  </span>
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isOverBudget
                      ? 'bg-rose-100 text-rose-700'
                      : budgetUsedPercent > 80
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {budgetUsedPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget
                      ? 'bg-rose-500'
                      : budgetUsedPercent > 80
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                {isOverBudget ? (
                  <span className="text-rose-600 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    เกินงบ ฿{formatCurrency(Math.abs(remainingBudget))}
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    เหลืองบ ฿{formatCurrency(remainingBudget)}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="py-2">
              <p className="text-xs text-slate-400 mb-3">
                ยังไม่ได้ตั้งงบรายจ่ายประจำเดือนนี้
              </p>
              <button
                id="btn-set-budget-cta"
                onClick={onOpenBudgetModal}
                className="w-full py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
              >
                + กำหนดงบประมาณ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
