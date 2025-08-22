import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/datepicker-chat.css';

type Props = { onConfirm?: (start: Date, end: Date) => void };

export default function CalendarBubble({ onConfirm }: Props) {
  const [isMd, setIsMd] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMd(e.matches);
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, []);

  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  const [locked, setLocked] = useState(false);
  const [start, end] = range;

  const ymd = (d?: Date | null) =>
    d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10) : '';

  const monthsShown = useMemo(() => (isMd ? 2 : 1), [isMd]);

  const handleChange = (update: [Date | null, Date | null]) => {
    if (locked) return;
    setRange(update);
  };

  useEffect(() => {
    if (!locked && start && end) {
      const t = setTimeout(() => {
        setLocked(true);
        onConfirm?.(start, end);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [start, end, locked, onConfirm]);

  return (
    <div className="space-y-2">
      <div className="text-[13px] text-gray-600">
        캘린더에서 <b>시작일과 종료일</b>을 선택하세요. 둘 다 선택하면 자동으로 확인합니다.
      </div>

      <div className={`relative rounded-xl ${locked ? 'opacity-70' : ''}`}>
        <DatePicker
          inline
          selectsRange
          monthsShown={monthsShown}
          startDate={start}
          endDate={end}
          onChange={(u) => handleChange(u as [Date | null, Date | null])}
          dayClassName={(d: Date): string => {
            const day = d.getDay();
            return day === 0 ? 'rdp-weekend-sun' : day === 6 ? 'rdp-weekend-sat' : '';
          }}
          fixedHeight
          showPopperArrow={false}
          calendarStartDay={0}
        />
        {locked && <div className="absolute inset-0 rounded-xl pointer-events-auto" />}
      </div>

      <div className="text-[12px] text-gray-500">
        {start || end ? (
          <>
            선택한 기간: <b>{ymd(start) || '—'}</b> ~ <b>{ymd(end) || '—'}</b>
            {locked && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px]">
                선택 완료
              </span>
            )}
          </>
        ) : (
          '기간을 선택하면 여기 표시됩니다.'
        )}
      </div>
    </div>
  );
}
