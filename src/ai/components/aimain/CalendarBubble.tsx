import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  onConfirm?: (start: Date, end: Date) => void;
};

export default function CalendarBubble({ onConfirm }: Props) {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (!fired && start && end) {
      setFired(true);
      setTimeout(() => onConfirm?.(start, end), 50);
    }
  }, [start, end, fired, onConfirm]);

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-700">
        캘린더에서 <b>시작일</b>과 <b>종료일</b>을 선택하세요. 둘 다 선택하면 자동으로 확인합니다.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-xs font-semibold mb-1">시작일</div>
          <DatePicker
            selected={start}
            onChange={(d) => setStart(d)}
            selectsStart
            startDate={start}
            endDate={end}
            dateFormat="yyyy-MM-dd"
            inline
          />
        </div>
        <div>
          <div className="text-xs font-semibold mb-1">종료일</div>
          <DatePicker
            selected={end}
            onChange={(d) => setEnd(d)}
            selectsEnd
            startDate={start}
            endDate={end}
            minDate={start || undefined}
            dateFormat="yyyy-MM-dd"
            inline
          />
        </div>
      </div>
    </div>
  );
}
