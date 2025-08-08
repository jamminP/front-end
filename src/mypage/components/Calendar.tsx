import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/calendar.css';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  // 추가된 상태: 특정 날짜의 모든 이벤트 보여주는 모달용
  const [moreEvents, setMoreEvents] = useState<{
    date: string;
    events: Event[];
  }>({ date: '', events: [] });

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setFormDate(formatDate(date));
    setFormTitle('');
    setFormDescription('');
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formTitle.trim()) return;

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

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setModalEvent(null);
  };

  const eventsOnDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter((e) => e.date === dateStr);
  };

  const handleEventClick = (event: Event) => {
    setModalEvent(event);
  };

  const handleEdit = () => {
    if (!modalEvent) return;
    setFormDate(modalEvent.date);
    setFormTitle(modalEvent.title);
    setFormDescription(modalEvent.description);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-[30px]">캘린더</h1>

      <Calendar
        onClickDay={handleDayClick}
        value={selectedDate}
        tileContent={({ date }) => {
          const dayEvents = eventsOnDate(date);
          return (
            <div className="mt-1 space-y-1 px-1">
              {dayEvents.slice(0, 3).map((e) => (
                <p
                  key={e.id}
                  className="text-xs bg-blue-100 text-blue-800 truncate cursor-pointer"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleEventClick(e);
                  }}
                >
                  {e.title}
                </p>
              ))}
              {dayEvents.length > 3 && (
                <p
                  className="more"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setMoreEvents({
                      date: formatDate(date),
                      events: dayEvents,
                    });
                  }}
                >
                  +{dayEvents.length - 3} more
                </p>
              )}
            </div>
          );
        }}
      />

      {/* 일정 상세 모달 */}
      {modalEvent && (
        <div className="modal-overlay">
          <div className="modal-container">
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
        <div className="modal-overlay">
          <div className="modal-container">
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

      {/* 여러 개 일정 모달 (more 클릭 시) */}
      {moreEvents.date && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="text-xl font-semibold mb-2">{moreEvents.date}의 일정 목록</h2>
            {moreEvents.events.map((event) => (
              <div
                key={event.id}
                className="border p-2 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setModalEvent(event);
                  setMoreEvents({ date: '', events: [] });
                }}
              >
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                className="text-gray-500"
                onClick={() => setMoreEvents({ date: '', events: [] })}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
