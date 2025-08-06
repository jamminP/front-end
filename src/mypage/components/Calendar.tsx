import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MyCalendar() {
  const [date, setDate] = useState(new Date());
  return (
    <>
      <h2 className="text-4xl text-[#242424] tracking-[-.05rem]">캘린더</h2>
      <div>
        <Calendar />
      </div>
    </>
  );
}
