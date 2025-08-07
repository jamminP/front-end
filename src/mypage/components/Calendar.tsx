import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
}

// 날짜 포맷 함수
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // localStorage에서 초기값 가져오기
  const [events, setEvents] = useState<Event[]>(() => {
    const stored = localStorage.getItem('calendar-events');
    return stored ? JSON.parse(stored) : [];
  });

  const [modalEvent, setModalEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState<string>('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  // 날짜 클릭 시 일정 추가 폼 열기
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setFormDate(formatDate(date));
    setFormTitle('');
    setFormDescription('');
    setIsEditing(false);
    setShowForm(true);
  };

  // 일정 등록/수정
  const handleSubmit = () => {
    if (!formTitle.trim()) {
      return alert('제목을 입력하세요');
    }

    const newEvent: Event = {
      id: isEditing && modalEvent ? modalEvent.id : Date.now().toString(),
      title: formTitle,
      description: formDescription,
      date: formDate,
    };

    setEvents((prev) =>
      isEditing ? prev.map((e) => (e.id === modalEvent?.id ? newEvent : e)) : [...prev, newEvent],
    );

    setShowForm(false);
    setModalEvent(null);
  };

  // 일정 삭제
  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setModalEvent(null);
  };

  // 특정 날짜의 일정 필터링
  const eventsOnDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter((e) => e.date === dateStr);
  };

  // 일정 클릭 → 상세 보기 모달 열기
  const handleEventClick = (event: Event) => {
    setModalEvent(event);
  };

  // 수정 버튼 클릭 시 일정 수정 폼 열기
  const handleEdit = () => {
    if (!modalEvent) return;
    setFormDate(modalEvent.date);
    setFormTitle(modalEvent.title);
    setFormDescription(modalEvent.description);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">캘린더</h1>

      {/* 달력 */}
      <Calendar
        onClickDay={handleDayClick}
        value={selectedDate}
        tileContent={({ date }) => {
          const dayEvents = eventsOnDate(date);
          return (
            <div className="mt-1 space-y-1 px-1">
              {dayEvents.slice(0, 1).map((e) => (
                <p
                  key={e.id}
                  className="text-xs bg-blue-100 text-blue-800 truncate px-1 rounded cursor-pointer"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleEventClick(e);
                  }}
                >
                  {e.title}
                </p>
              ))}
              {dayEvents.length > 1 && (
                <p className="text-[10px] text-gray-400">+{dayEvents.length - 1} more</p>
              )}
            </div>
          );
        }}
      />

      {/* 일정 상세 모달 */}
      {modalEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-2">{modalEvent.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{modalEvent.date}</p>
            <p className="mb-4">{modalEvent.description}</p>
            <div className="flex justify-end gap-2">
              <button className="text-red-500" onClick={() => handleDelete(modalEvent.id)}>
                삭제
              </button>
              <button className="text-blue-500" onClick={handleEdit}>
                수정
              </button>
              <button className="text-gray-500" onClick={() => setModalEvent(null)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 일정 추가/수정 폼 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-[90%] max-w-md space-y-3">
            <h2 className="text-xl font-semibold">
              {isEditing ? '일정 수정' : `${formDate} 일정 추가`}
            </h2>
            <input
              type="text"
              placeholder="제목"
              className="w-full border px-2 py-1"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <textarea
              placeholder="내용"
              className="w-full border px-2 py-1"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="text-gray-500"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                }}
              >
                취소
              </button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleSubmit}>
                {isEditing ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
