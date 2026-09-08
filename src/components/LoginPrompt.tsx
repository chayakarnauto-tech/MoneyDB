import React, { useState } from 'react';
import {
  Wallet,
  ShieldCheck,
  PieChart,
  Calendar,
  LogIn,
  Database,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPrompt: React.FC = () => {
  const {
    signInWithGoogle,
    continueAsGuest,
    authError,
    isUnauthorizedDomain,
    isOperationNotAllowed,
    currentDomain,
    loading,
  } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyDomain = () => {
    const domain = currentDomain || (typeof window !== 'undefined' ? window.location.hostname : '');
    if (domain) {
      navigator.clipboard.writeText(domain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
            <button
              id="btn-google-login-hero"
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all transform active:scale-98"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <span>เข้าสู่ระบบด้วย Gmail</span>
            </button>

            <button
              id="btn-guest-mode-hero"
              type="button"
              onClick={continueAsGuest}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-semibold text-sm rounded-2xl border border-emerald-300 transition-all transform active:scale-98 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>ทดลองใช้งานทันที (Guest)</span>
            </button>
          </div>

          {authError && (
            <div className="w-full max-w-lg mt-2 text-left">
              {isOperationNotAllowed ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 shadow-sm space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm text-amber-950">
                        ยังไม่ได้เปิดใช้งาน Google Sign-In ใน Firebase Console
                      </h3>
                      <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                        ข้อผิดพลาด <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">auth/operation-not-allowed</code> เกิดจากโปรเจกต์ Firebase <strong className="font-semibold text-slate-900">moneydb-ef295</strong> ยังไม่ได้เปิดสวิตช์ผู้ให้บริการ Google ให้ลงชื่อเข้าใช้ได้ครับ
                      </p>
                    </div>
                  </div>

                  {/* Direct Action Link to Firebase Console */}
                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <a
                      href="https://console.firebase.google.com/project/moneydb-ef295/authentication/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-xl shadow-xs transition inline-flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>เปิดหน้าตั้งค่า Sign-in method ใน Firebase</span>
                    </a>
                    <button
                      type="button"
                      onClick={continueAsGuest}
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-xs transition inline-flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>ทดลองใช้งานทันที (Guest)</span>
                    </button>
                  </div>

                  {/* Steps Guide */}
                  <div className="text-xs text-amber-950/90 bg-white/80 p-3 rounded-xl border border-amber-200/70 space-y-1.5">
                    <p className="font-bold text-amber-950">ขั้นตอนเปิดใช้งาน (ทำเพียงครั้งเดียว 1 นาที):</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-700 pl-1">
                      <li>
                        เข้า <a href="https://console.firebase.google.com/project/moneydb-ef295/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-0.5">Firebase Console แท็บ Sign-in method <ExternalLink className="w-3 h-3 inline" /></a>
                      </li>
                      <li>คลิกที่แถว <strong>Google</strong> (หรือปุ่ม Add new provider &gt; Google)</li>
                      <li>คลิกเปิดสวิตช์ <strong>Enable</strong> (เปิดใช้งาน)</li>
                      <li>เลือกอีเมลในช่อง <strong>Project support email</strong></li>
                      <li>กดปุ่ม <strong>Save (บันทึก)</strong></li>
                      <li>
                        <em>(แนะนำสำหรับ Vercel)</em> ไปที่แท็บ <strong>Settings</strong> &gt; <strong>Authorized domains</strong> และตรวจสอบว่ามีโดเมน <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">{currentDomain || 'money-db-six.vercel.app'}</code> หรือยัง
                      </li>
                    </ol>
                  </div>

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>บันทึกใน Firebase แล้ว? คลิกเพื่อลองเข้าสู่ระบบอีกครั้ง</span>
                    </button>
                  </div>
                </div>
              ) : isUnauthorizedDomain ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm text-amber-900">
                        โดเมนยังไม่ได้รับอนุญาตใน Firebase (auth/unauthorized-domain)
                      </h3>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        เนื่องจากเว็บไซต์นี้ถูกเปิดบนโดเมนใหม่ (เช่น Vercel) ระบบความปลอดภัยของ Google/Firebase จึงต้องเพิ่มชื่อโดเมนนี้ลงใน Authorized Domains ก่อนครับ หรือคุณสามารถกดเข้าใช้งานโหมดทดลองใช้ได้ทันที
                      </p>
                    </div>
                  </div>

                  {/* Bypass button for immediate usage */}
                  <div className="pt-1">
                    <button
                      id="btn-bypass-unauthorized-guest"
                      type="button"
                      onClick={continueAsGuest}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>เข้าใช้งานทันทีในโหมดทดลองใช้ (บันทึกข้อมูลในเครื่อง)</span>
                    </button>
                  </div>

                  {/* Domain Copy Box */}
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-800 break-all select-all">
                      {currentDomain || (typeof window !== 'undefined' ? window.location.hostname : '')}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyDomain}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>คัดลอกโดเมน</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Steps Guide */}
                  <div className="text-xs text-amber-900/90 bg-amber-100/50 p-2.5 rounded-xl space-y-1.5">
                    <p className="font-semibold">วิธีเพิ่มโดเมนใน Firebase Console ของคุณ:</p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1">
                      <li>
                        เปิด Firebase Console ที่โปรเจกต์ของคุณ
                      </li>
                      <li>ไปที่เมนู <strong>Authentication</strong> &gt; แถบ <strong>Settings</strong></li>
                      <li>เลื่อนลงมาที่หัวข้อ <strong>Authorized domains</strong> (โดเมนที่ได้รับอนุญาต)</li>
                      <li>กดปุ่ม <strong>Add domain</strong> วางโดเมนข้างต้น แล้วกด <strong>Add</strong></li>
                      <li>กลับมาหน้านี้แล้วกดปุ่มเข้าสู่ระบบด้วย Gmail ได้ทันที</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-center text-rose-600 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
                  {authError}
                </p>
              )}
            </div>
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
