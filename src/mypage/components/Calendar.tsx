import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
};

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // localStorage 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("events");
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  // localStorage 저장
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // 날짜 클릭 시 모달 열기
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewTitle("");
    setNewDesc("");
    setIsModalOpen(true);
  };

  // 일정 추가
  const handleAddEvent = () => {
    if (!selectedDate || !newTitle) return;

    const newEvent: Event = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      date: selectedDate.toISOString().split("T")[0],
    };

    setEvents((prev) => [...prev, newEvent]);
    setIsModalOpen(false);
  };

  // 삭제
  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const eventsForSelectedDate = selectedDate
    ? events.filter((ev) => ev.date === selectedDate.toISOString().split("T")[0])
    : [];

  return (
    <>
      <h2 className="text-4xl text-[#242424] tracking-[-.05rem]">캘린더</h2>
      <div className="p-4">
        <Calendar onClickDay={handleDateClick} />

        {/* 일정 목록 */}
        {selectedDate && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">{selectedDate.toDateString()} 일정</h3>
            <ul className="mt-2">
              {eventsForSelectedDate.map((ev) => (
                <li
                  key={ev.id}
                  className="border-b py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{ev.title}</p>
                    <p className="text-sm text-gray-500">{ev.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="text-red-500 text-sm"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {selectedDate?.toDateString()} 일정 추가
            </h3>
            <input
              type="text"
              placeholder="제목"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border p-2 mb-2"
            />
            <textarea
              placeholder="내용"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full border p-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                취소
              </button>
              <button
                onClick={handleAddEvent}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
