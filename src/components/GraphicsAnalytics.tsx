import React, { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { Transaction, CATEGORIES } from '../types';
import { formatCurrency } from '../utils/formatters';

interface GraphicsAnalyticsProps {
  transactions: Transaction[];
  selectedMonth: string;
}

const CATEGORY_COLOR_PALETTE = [
  '#f97316', // Orange
  '#0ea5e9', // Sky
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
  '#ef4444', // Red
  '#6366f1', // Indigo
  '#eab308', // Yellow
  '#10b981', // Emerald
  '#64748b', // Slate
];

export const GraphicsAnalytics: React.FC<GraphicsAnalyticsProps> = ({
  transactions,
  selectedMonth,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'donut' | 'daily' | 'comparison'>('donut');

  // Expense breakdown by category
  const expenseByCategory = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const totalExp = expenses.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap: { [key: string]: number } = {};
    expenses.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const data = Object.entries(categoryMap).map(([name, value], index) => {
      const catConfig = CATEGORIES.find((c) => c.name === name);
      return {
        name,
        value,
        percentage: totalExp > 0 ? Math.round((value / totalExp) * 100) : 0,
        color: catConfig?.color || CATEGORY_COLOR_PALETTE[index % CATEGORY_COLOR_PALETTE.length],
      };
    });

    // Sort descending
    return data.sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Daily timeline data for selected month
  const dailyData = useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    // Number of days in this month
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateKey = `${yearStr}-${monthStr.padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      return {
        day: `${dayNum}`,
        date: dateKey,
        income: 0,
        expense: 0,
      };
    });

    transactions.forEach((t) => {
      if (t.date && t.date.startsWith(selectedMonth)) {
        const day = parseInt(t.date.split('-')[2], 10);
        if (day >= 1 && day <= daysInMonth) {
          if (t.type === 'income') {
            daysArray[day - 1].income += t.amount;
          } else {
            daysArray[day - 1].expense += t.amount;
          }
        }
      }
    });

    return daysArray;
  }, [transactions, selectedMonth]);

  // Overall Income vs Expense Totals
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const comparisonData = useMemo(() => {
    return [
      {
        name: 'เปรียบเทียบยอดเงิน',
        รายรับ: totalIncome,
        รายจ่าย: totalExpense,
      },
    ];
  }, [totalIncome, totalExpense]);

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">
          ยังไม่มีข้อมูลสำหรับวิเคราะห์กราฟ
        </h3>
        <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
          เริ่มต้นบันทึกรายรับหรือรายจ่ายของเดือนนี้เพื่อดูการวิเคราะห์และกราฟฟิคสรุปผลแบบเรียลไทม์
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Section Header with View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              กราฟฟิควิเคราะห์ข้อมูลทางการเงิน
            </h2>
            <p className="text-xs text-slate-400">
              ภาพรวมและแนวโน้มการเงินประจำเดือน
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs">
          <button
            id="tab-chart-donut"
            onClick={() => setActiveChartTab('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeChartTab === 'donut'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>สัดส่วนรายจ่าย</span>
          </button>
          <button
            id="tab-chart-daily"
            onClick={() => setActiveChartTab('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeChartTab === 'daily'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>แนวโน้มรายวัน</span>
          </button>
          <button
            id="tab-chart-comparison"
            onClick={() => setActiveChartTab('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeChartTab === 'comparison'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>เปรียบเทียบยอด</span>
          </button>
        </div>
      </div>

      {/* Main Visual Panels */}
      {activeChartTab === 'donut' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Donut Chart */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-700">
                  สัดส่วนรายจ่ายตามหมวดหมู่ (Expense Distribution)
                </span>
                <span className="text-xs text-slate-400">
                  รวม ฿{formatCurrency(totalExpense)}
                </span>
              </div>

              {expenseByCategory.length > 0 ? (
                <div className="h-64 sm:h-72 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {expenseByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: number) => [`฿${formatCurrency(val)}`, 'จำนวนเงิน']}
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text inside Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[11px] text-slate-400 font-medium">รายจ่ายรวม</span>
                    <span className="text-base font-bold text-slate-800">
                      ฿{formatCurrency(totalExpense)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
                  <Layers className="w-8 h-8 mb-2 text-slate-300" />
                  <span>ยังไม่มีรายการรายจ่ายในเดือนนี้</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
              <span>หมวดหมู่ทั้งหมด: {expenseByCategory.length} หมวด</span>
              <span>คลิกหรือชี้บนกราฟเพื่อดูรายละเอียด</span>
            </div>
          </div>

          {/* Ranked Categories Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col">
            <h3 className="text-xs font-semibold text-slate-700 mb-3">
              อันดับค่าใช้จ่ายสูงสุด (Top Spending)
            </h3>

            {expenseByCategory.length > 0 ? (
              <div className="space-y-3.5 overflow-y-auto max-h-72 pr-1">
                {expenseByCategory.slice(0, 6).map((cat, idx) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium text-slate-700 line-clamp-1">
                          {cat.name}
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">
                          ฿{formatCurrency(cat.value)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                ไม่มีรายการรายจ่าย
              </div>
            )}
          </div>
        </div>
      )}

      {activeChartTab === 'daily' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-700">
                แนวโน้มรายรับ-รายจ่าย รายวันตลอดเดือน
              </h3>
              <p className="text-[11px] text-slate-400">
                ติดตามจังหวะการไหลเวียนของเงินในแต่ละวัน
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-slate-600">รายรับ (Income)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500" />
                <span className="text-slate-600">รายจ่าย (Expense)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : `${val}`)}
                />
                <Tooltip
                  formatter={(val: number) => [`฿${formatCurrency(val)}`, '']}
                  labelFormatter={(day) => `วันที่ ${day} ของเดือน`}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="รายรับ"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="รายจ่าย"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeChartTab === 'comparison' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-slate-700">
              เปรียบเทียบสัดส่วนรายรับ vs รายจ่าย
            </h3>
            <p className="text-[11px] text-slate-400">
              วิเคราะห์ความสมดุลทางการเงิน
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `฿${formatCurrency(val)}`}
                />
                <Tooltip
                  formatter={(val: number) => [`฿${formatCurrency(val)}`, '']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="รายรับ" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={60} />
                <Bar dataKey="รายจ่าย" fill="#f43f5e" radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Balance Summary Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">สถานะกระแสเงินสด:</span>
              <span
                className={`font-semibold ${
                  totalIncome >= totalExpense ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {totalIncome >= totalExpense
                  ? `กำไร/คงเหลือสุทธิ +฿${formatCurrency(totalIncome - totalExpense)}`
                  : `ขาดดุล/ใช้จ่ายเกินรายรับ -฿${formatCurrency(totalExpense - totalIncome)}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
