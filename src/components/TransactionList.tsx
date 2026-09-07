import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Edit3,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';
import { Transaction, CATEGORIES } from '../types';
import { formatCurrency, formatThaiDate } from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  selectedMonth: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
  onOpenAddModal: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  selectedMonth,
  onEdit,
  onDelete,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter and sort transactions (newest date first)
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Type filter
        if (filterType !== 'all' && t.type !== filterType) return false;

        // Category filter
        if (filterCategory !== 'all' && t.category !== filterCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNote = t.note?.toLowerCase().includes(q);
          const matchCat = t.category.toLowerCase().includes(q);
          const matchMethod = t.paymentMethod?.toLowerCase().includes(q);
          if (!matchNote && !matchCat && !matchMethod) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterCategory, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['วันที่', 'ประเภท', 'หมวดหมู่', 'จำนวนเงิน(บาท)', 'ช่องทางชำระ', 'บันทึก'];
    const rows = filteredTransactions.map((t) => [
      `"${t.date}"`,
      `"${t.type === 'income' ? 'รายรับ' : 'รายจ่าย'}"`,
      `"${t.category}"`,
      t.amount,
      `"${t.paymentMethod || ''}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MoneyDB-Report-${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
      try {
        setDeletingId(id);
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              ประวัติรายการรายรับ - รายจ่าย
            </h2>
            <p className="text-xs text-slate-400">
              พบ {filteredTransactions.length} รายการ จากทั้งหมด {transactions.length} รายการ
            </p>
          </div>

          {/* Export and Add button */}
          <div className="flex items-center gap-2">
            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              disabled={transactions.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="ดาวน์โหลดเป็นไฟล์ CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ส่งออก CSV</span>
            </button>

            <button
              id="btn-add-transaction-list"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มรายการ</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-transaction"
              type="text"
              placeholder="ค้นหาตามบันทึก, หมวดหมู่, ช่องทาง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="sm:col-span-4 flex items-center bg-slate-100 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รายรับ
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                filterType === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              รายจ่าย
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              id="select-filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">ทุกหมวดหมู่</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      {filteredTransactions.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {filteredTransactions.map((tx) => {
            const catInfo = CATEGORIES.find((c) => c.name === tx.category);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="p-4 sm:px-5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 group"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {tx.category}
                      </span>
                      {tx.paymentMethod && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-normal">
                          <CreditCard className="w-2.5 h-2.5" />
                          {tx.paymentMethod}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{formatThaiDate(tx.date)}</span>
                      {tx.note && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 truncate max-w-[200px] sm:max-w-xs">
                            {tx.note}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-bold tracking-tight ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}฿{formatCurrency(tx.amount)}
                    </span>
                    <p className="text-[10px] text-slate-400 sm:hidden">
                      {tx.paymentMethod}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(tx)}
                      title="แก้ไขรายการ"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-lg transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tx.id)}
                      disabled={deletingId === tx.id}
                      title="ลบรายการ"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">
            ไม่พบรายการรายรับ - รายจ่าย
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || filterCategory !== 'all' || filterType !== 'all'
              ? 'ลองปรับเปลี่ยนเงื่อนไขการค้นหาหรือตัวกรองด้านบน'
              : 'ยังไม่มีรายการสำหรับเดือนนี้ คลิกปุ่มด้านล่างเพื่อเริ่มบันทึก'}
          </p>
          {!(searchQuery || filterCategory !== 'all' || filterType !== 'all') && (
            <button
              id="btn-add-first-transaction"
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>บันทึกรายการแรก</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
