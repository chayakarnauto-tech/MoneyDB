import React from 'react';
import {
  Wallet,
  LogOut,
  LogIn,
  ChevronLeft,
  ChevronRight,
  Plus,
  Database,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatMonthYear, THAI_MONTHS } from '../utils/formatters';

interface NavbarProps {
  selectedMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedMonth,
  onMonthChange,
  onOpenAddModal,
}) => {
  const { user, signInWithGoogle, signOutUser } = useAuth();

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200/80 shadow-xs bg-white p-0.5">
              <img
                src="/logo.png"
                alt="วิทยาลัยอาชีวศึกษาแพร่"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  MoneyDB
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <Database className="w-3 h-3" />
                  Firebase
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ระบบจัดการรายรับรายจ่าย & วิเคราะห์ข้อมูล
              </p>
            </div>
          </div>

          {/* Month Selector */}
          {user && (
            <div className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200/80">
              <button
                id="btn-prev-month"
                onClick={handlePrevMonth}
                title="เดือนก่อนหน้า"
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1 font-medium text-sm text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formatMonthYear(selectedMonth)}</span>
              </div>

              <button
                id="btn-next-month"
                onClick={handleNextMonth}
                title="เดือนถัดไป"
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Actions & User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <button
                  id="btn-add-transaction-nav"
                  onClick={onOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-medium rounded-xl shadow-sm transition shadow-emerald-200"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">บันทึกรายการ</span>
                  <span className="sm:hidden">บันทึก</span>
                </button>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-9 h-9 rounded-full ring-2 ring-emerald-100 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-semibold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[130px]">
                      {user.displayName || 'ผู้ใช้งาน'}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[130px]">
                      {user.email}
                    </p>
                  </div>
                  <button
                    id="btn-logout"
                    onClick={signOutUser}
                    title="ออกจากระบบ"
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                id="btn-login-google"
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl shadow transition"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบด้วย Gmail</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
