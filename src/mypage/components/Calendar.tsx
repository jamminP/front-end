import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/calendar.css';
import StudyPlanFetcher from './StudyPlanFetcher';

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

interface MyCalendarProps {
  aiPlanId?: string; // AI 채팅에서 받아오는 planId
}

export default function MyCalendar({ aiPlanId }: MyCalendarProps) {
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

  const [moreEvents, setMoreEvents] = useState<{
    date: string;
    events: Event[];
  }>({ date: '', events: [] });

  // 로컬스토리지에 이벤트 저장
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
    if (!formTitle.trim()) return alert('제목을 입력해주세요');

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
    if (isEditing) {
      alert('수정되었습니다');
    } else {
      alert('등록되었습니다');
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;

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
      <h1 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem] mb-[30px]">캘린더</h1>

      {/* AI planId가 있을 때만 StudyPlanFetcher 실행 */}
      {aiPlanId && (
        <StudyPlanFetcher
          planId={aiPlanId}
          onEventsGenerated={(newEvents) => setEvents((prev) => [...prev, ...newEvents])}
        />
      )}

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

      <ul className="mt-4 space-y-2">
        {events.map((ev) => (
          <li key={ev.id} className="border p-2 rounded">
            <strong>{ev.date}</strong> - {ev.title}
            <p className="text-xs text-gray-500">{ev.description}</p>
          </li>
        ))}
      </ul>

      {/* 일정 상세 모달 */}
      {modalEvent && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">{modalEvent.title}</h2>
            <p className="modal-date">{modalEvent.date}</p>
            <div className="modal-description">
              {modalEvent.description.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
            <div className="modal-button">
              <button onClick={() => handleDelete(modalEvent.id)}>삭제</button>
              <button onClick={handleEdit}>수정</button>
            </div>
            <button className="modal-close" onClick={() => setModalEvent(null)}>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      )}

      {/* 일정 추가/수정 폼 모달 */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">{isEditing ? '일정 수정' : `${formDate} 일정 추가`}</h2>
            <input
              type="text"
              maxLength={30}
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
            <div className="modal-button">
              <button onClick={handleSubmit}>{isEditing ? '수정' : '추가'}</button>
            </div>
            <button
              className="modal-close"
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
              }}
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      )}

      {/* 여러 개 일정 모달 (more 클릭 시) */}
      {moreEvents.date && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">{moreEvents.date}의 일정 목록</h2>
            {moreEvents.events.map((event) => (
              <div
                key={event.id}
                className="modal-list"
                onClick={() => {
                  setModalEvent(event);
                  setMoreEvents({ date: '', events: [] });
                }}
              >
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
            ))}
            <button className="modal-close" onClick={() => setMoreEvents({ date: '', events: [] })}>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
