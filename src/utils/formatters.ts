export const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatThaiDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;
  const monthName = THAI_MONTHS[month - 1] || '';
  const buddhistYear = year + 543;
  return `${day} ${monthName} ${buddhistYear}`;
};

export const formatMonthYear = (monthString: string): string => {
  // format: YYYY-MM
  if (!monthString) return '';
  const [year, month] = monthString.split('-').map(Number);
  if (!year || !month) return monthString;
  const monthName = THAI_MONTHS[month - 1] || '';
  const buddhistYear = year + 543;
  return `${monthName} ${buddhistYear}`;
};

export const getCurrentMonthString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
