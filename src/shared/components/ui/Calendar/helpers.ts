export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Get days for the calendar grid
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
};

export const generateCalendarDays = (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];

  // Previous month days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      isCurrentMonth: false,
      isFuture: false,
      isPrevMonth: true,
      isToday: false,
      fullDate: new Date(prevYear, prevMonth, daysInPrevMonth - i)
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const today = new Date();
    const fullDate = new Date(year, month, day);
    days.push({
      date: day,
      isCurrentMonth: true,
      isFuture: day > today.getDate(),
      isPrevMonth: false,
      isToday:
        fullDate.getDate() === today.getDate() &&
        fullDate.getMonth() === today.getMonth() &&
        fullDate.getFullYear() === today.getFullYear(),

      fullDate
    });
  }

  // Next month days
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      date: day,
      isCurrentMonth: false,
      isPrevMonth: false,
      isFuture: true,
      fullDate: new Date(nextYear, nextMonth, day)
    });
  }

  return days;
};

export const generateYearOptions = (currentDate: Date) => {
  const currentYear = currentDate.getFullYear();
  const years = [];

  for (let i = currentYear; i > currentYear - 120; i--) {
    years.push(i);
  }

  return years;
};
