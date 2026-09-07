import React from 'react';
import {
  Wallet,
  ShieldCheck,
  PieChart,
  Calendar,
  LogIn,
  Database,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPrompt: React.FC = () => {
  const { signInWithGoogle, authError, loading } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl shadow-slate-100 text-center">
        {/* College Logo */}
        <div className="w-20 h-20 rounded-full mx-auto mb-4 p-1 bg-white border-2 border-slate-200 shadow-md">
          <img
            src="/logo.png"
            alt="วิทยาลัยอาชีวศึกษาแพร่"
            className="w-full h-full object-contain rounded-full"
          />
        </div>

        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/60 mb-6">
          <Database className="w-3.5 h-3.5" />
          <span>ระบบเชื่อมต่อฐานข้อมูล Firebase: MoneyDB</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight max-w-2xl mx-auto">
          เว็บจัดการรายรับรายจ่าย พร้อมกราฟฟิคสรุปผลประจำเดือน
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          ติดตามทุกบาททุกสตางค์ วางแผนงบประมาณ และวิเคราะห์พฤติกรรมการใช้จ่ายของคุณด้วยกราฟิกแบบอินเทอร์แอคทีฟ
          ข้อมูลทั้งหมดจะถูกจัดเก็บลงในบัญชีของคุณบน Firebase อย่างปลอดภัย
        </p>

        {/* Sign In CTA */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <button
            id="btn-google-login-hero"
            onClick={signInWithGoogle}
            disabled={loading}
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all transform active:scale-98"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>เข้าสู่ระบบด้วย Gmail (Google Account)</span>
          </button>

          {authError && (
            <p className="text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
              {authError}
            </p>
          )}

          <span className="text-xs text-slate-400">
            ใช้งานได้ทันทีโดยไม่ต้องจำรหัสผ่านแยก
          </span>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <PieChart className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">
              กราฟฟิควิเคราะห์เชิงลึก
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              แผนภูมิโดนัทแสดงสัดส่วนค่าใช้จ่าย กราฟแท่งเปรียบเทียบ และแนวโน้มกระแสเงินสดประจำวัน
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">
              สรุปผลแบบรายเดือน
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              เลือกดูสรุปยอดรายรับ รายจ่าย คงเหลือสุทธิ อัตราการออม และตั้งเป้างบประมาณได้ทุกเดือน
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">
              ปลอดภัยบน Firebase
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              จัดเก็บข้อมูลลง Firestore แบบเรียลไทม์ ซิงก์ได้ทันที พร้อมกฎความปลอดภัยแยกบัญชีผู้ใช้
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
