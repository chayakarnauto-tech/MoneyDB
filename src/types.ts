export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'transfer' | 'credit_card' | 'other';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface Budget {
  id?: string;
  userId: string;
  month: string; // YYYY-MM
  monthlyLimit: number;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  // Expenses
  { id: 'food', name: 'อาหารและเครื่องดื่ม', icon: 'Utensils', type: 'expense', color: '#f97316' },
  { id: 'transport', name: 'การเดินทาง/น้ำมัน', icon: 'Car', type: 'expense', color: '#0ea5e9' },
  { id: 'shopping', name: 'ช้อปปิ้ง/ของใช้', icon: 'ShoppingBag', type: 'expense', color: '#ec4899' },
  { id: 'housing', name: 'ค่าที่พัก/ค่าน้ำค่าไฟ', icon: 'Home', type: 'expense', color: '#8b5cf6' },
  { id: 'entertainment', name: 'บันเทิง/สังสรรค์', icon: 'Film', type: 'expense', color: '#14b8a6' },
  { id: 'health', name: 'สุขภาพ/ยา/ความงาม', icon: 'HeartPulse', type: 'expense', color: '#ef4444' },
  { id: 'education', name: 'การศึกษา/พัฒนาตนเอง', icon: 'GraduationCap', type: 'expense', color: '#6366f1' },
  { id: 'bills', name: 'ค่าบริการ/หนี้สิน', icon: 'Receipt', type: 'expense', color: '#64748b' },
  { id: 'other_expense', name: 'รายจ่ายอื่นๆ', icon: 'MoreHorizontal', type: 'expense', color: '#94a3b8' },

  // Incomes
  { id: 'salary', name: 'เงินเดือน/โบนัส', icon: 'Banknote', type: 'income', color: '#10b981' },
  { id: 'freelance', name: 'ธุรกิจ/ฟรีแลนซ์/งานเสริม', icon: 'Briefcase', type: 'income', color: '#059669' },
  { id: 'investment', name: 'เงินปันผล/ดอกเบี้ย/ลงทุน', icon: 'TrendingUp', type: 'income', color: '#047857' },
  { id: 'gift', name: 'ได้รับจากผู้อื่น/ของขวัญ', icon: 'Gift', type: 'income', color: '#34d399' },
  { id: 'other_income', name: 'รายรับอื่นๆ', icon: 'Coins', type: 'income', color: '#6ee7b7' },
];

export const PAYMENT_METHODS: { id: string; name: string }[] = [
  { id: 'โอนเงิน/QR PromptPay', name: 'โอนเงิน / สแกน QR' },
  { id: 'เงินสด', name: 'เงินสด' },
  { id: 'บัตรเครดิต/เดบิต', name: 'บัตรเครดิต / เดบิต' },
  { id: 'อื่นๆ', name: 'อื่นๆ' },
];
