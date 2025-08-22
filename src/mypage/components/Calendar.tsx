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

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [modalEvent, setModalEvent] = useState<Event | null>(null);
  const [moreEvents, setMoreEvents] = useState<{ date: string; events: Event[] }>({
    date: '',
    events: [],
  });

  const eventsOnDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter((e) => e.date === dateStr);
  };

  return (
    <div>
      <h1 className="text-3xl md:text-4xl mb-[30px]">캘린더</h1>

      {/* StudyPlanFetcher */}
      <StudyPlanFetcher
        onEventsGenerated={(newEvents) => {
          // 중복 방지
          setEvents((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            return [...prev, ...newEvents.filter((e) => !existingIds.has(e.id))];
          });
        }}
      />

      <Calendar
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
                    setModalEvent(e);
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
                    setMoreEvents({ date: formatDate(date), events: dayEvents });
                  }}
                >
                  +{dayEvents.length - 3} more
                </p>
              )}
            </div>
          );
        }}
      />

      {/* 상세 모달 */}
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
            <button className="modal-close" onClick={() => setModalEvent(null)}>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      )}

      {/* 더보기 일정 모달 */}
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
