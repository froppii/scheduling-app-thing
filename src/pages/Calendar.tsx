import React, { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  format,
  isToday,
  isSameDay,
  parseISO,
  addDays
} from 'date-fns';

import { CalendarEvent } from '../types';

interface CalendarProps {
  events: CalendarEvent[];
  addEvent: (data: { title: string; date: string, description: string }) => void;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  addEvent,
  showModal,
  setShowModal
}) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'year' | 'month' | 'week' | 'day'>('month');

  const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(currentYear, parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), currentMonth, 1));
  };

  const goToPreviousMonth = () => setViewDate(subMonths(viewDate, 1));
  const goToNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const years = Array.from({ length: 100 }, (_, i) => i + 1970);
  const months = Array.from({ length: 12 }, (_, i) => i);

  const openModal = (date: Date) => {
    setSelectedDate(date);
    setEventTitle('');
    setEventTime('');
    setEventDescription('');
    setShowModal(true);
  };

  const handleAddEvent = () => {
    if (selectedDate && eventTitle && eventTime) {
      const fullDateTime = `${format(selectedDate, 'yyyy-MM-dd')}T${eventTime}`;
      addEvent({ title: eventTitle, date: fullDateTime, description: eventDescription });
      setShowModal(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={goToPreviousMonth} className="px-2 py-1 bg-gray-200 rounded">&lt;</button>
          <select value={currentMonth} onChange={handleMonthChange} className="border p-1 rounded">
            {months.map((month) => (
              <option key={month} value={month}>
                {format(new Date(currentYear, month, 1), 'MMMM')}
              </option>
            ))}
          </select>
          <select value={currentYear} onChange={handleYearChange} className="border p-1 rounded">
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button onClick={goToNextMonth} className="px-2 py-1 bg-gray-200 rounded">&gt;</button>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="viewMode" className="mr-2 font-semibold">View:</label>
        <select
          id="viewMode"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as 'year' | 'month' | 'week' | 'day')}
          className="border p-1 rounded"
        >
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </select>
      </div>

      {viewMode === 'month' && (
        <div className="grid grid-cols-7 border border-gray-300">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="font-semibold text-center py-2 border-b border-gray-300 bg-gray-100">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const dayEvents = events
              .filter((event) => isSameDay(parseISO(event.date), day))
              .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
            );

            return (
              <div
                key={day.toISOString()}
                className={`h-28 border p-1 text-sm flex flex-col gap-1 cursor-pointer 
                  ${isCurrentMonth ? '' : 'text-gray-400 bg-gray-50'}
                  ${isToday(day) ? 'bg-blue-100 border-blue-500' : ''}
                  hover:bg-blue-200`}
                onClick={() => openModal(day)}
              >
                <div className="font-semibold">{format(day, 'd')}</div>
                {dayEvents.map((event, idx) =>(
                  <div key={idx} onClick={(e) => {
                    e.stopPropagation();
                    setViewingEvent(event);
                  }}
                    className="bg-blue-200 text-xs rounded px-1 truncate hover:bg-blue-300 cursor-pointer">
                    {format(parseISO(event.date), 'HH:mm')} - {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'week' && (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 sticky top-0 bg-white z-10">
            <div className="border p-2 font-bold bg-gray-100">Time</div>
            {[...Array(7)].map((_, i) => {
              const day = addDays(startOfWeek(viewDate, { weekStartsOn: 0}), i);
              return (
                <div key={i} className="border p-2 font-bold text-center bg-gray-100">
                  {format(day, 'EEEE')}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-8">
            {[...Array(24)].map((_, hour) => (
              <React.Fragment key={hour}>
                <div className="border p-2 text-sm bg-gray-50 whitespace-nowrap">
                  {format(new Date().setHours(hour, 0, 0, 0), 'hh:00 a')}
                </div>
                {[...Array(7)].map((_, dayIdx) => {
                  const date = addDays(startOfWeek(viewDate, { weekStartsOn: 0 }), dayIdx);
                  const eventsAtHour = events.filter(event =>
                    isSameDay(parseISO(event.date), date) &&
                    parseISO(event.date).getHours() === hour
                  );
                  return (
                    <div
                      key={dayIdx}
                      className="border p-1 text-xs min-h-[50px] hover:bg-blue-100 cursor-pointer"
                      onClick={() => openModal(date)}
                    >
                      {eventsAtHour.map((event, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingEvent(event);
                          }}
                          className="bg-blue-200 rounded px-1 mb-1 truncate"
                        >
                          {format(parseISO(event.date), 'HH:mm')} - {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'day' && (
        <div>
          <h2 className="text-lg font-semibold mb-2"></h2>
          <div className="border rounded overflow-hidden">
            {[...Array(24)].map((_, hour) => {
              const dateAtHour = new Date(viewDate);
              dateAtHour.setHours(hour, 0, 0, 0);

              const eventsAtHour = events.filter(event =>
                isSameDay(parseISO(event.date), viewDate) &&
                parseISO(event.date).getHours() === hour
              );

              return (
                <div
                  key={hour}
                  className="border-t p-2 flex items-start gap-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => openModal(dateAtHour)}
                >
                  <div className="w-16 text-sm text-gray-600">{format(dateAtHour, 'hh:mm a')}</div>
                  <div className="flex-1 space-y-1">
                    {eventsAtHour.map((event, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingEvent(event);
                        }}
                        className="bg-blue-200 rounded px-2 py-1 text-sm truncate"
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>  
      )}

      {viewMode === 'year' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">{currentYear}</h2>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length:12 }).map((_, monthIndex) => {
              const firstDayOfMonth = new Date(currentYear, monthIndex, 1);
              const start = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
              const end = endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn: 0 });
              const days = eachDayOfInterval({ start, end });

              return (
                <div key={monthIndex} className="border rounded p-2">
                  <h3 className="text-center font-semibold mb-2">
                    {format(firstDayOfMonth, 'MMMM')}
                  </h3>
                  <div className="grid grid-cols-7 text-xs mb-1 text-center text-gray-500">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {days.map((day) => {
                      const inCurrentMonth = day.getMonth() === monthIndex;
                      const hasEvents = events.some(event =>
                        isSameDay(parseISO(event.date), day)
                      );
                      return (
                        <div
                          key={day.toISOString()}
                          onClick={() => openModal(day)}
                          className={`rounded p-1 cursor-pointer hover:bg-blue-100
                            ${inCurrentMonth ? '' : 'text-gray-300'}
                            ${isToday(day) ? 'bg-blue-100 font-bold' : ''}
                            ${hasEvents ? 'bg-blue-200' : ''}`}
                        >
                          {format(day, 'd')}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-80">
            <h2 className="text-lg font-semibold mb-2">Add Event for {format(selectedDate, 'PPP')}</h2>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Event Title"
              className="border p-1 w-full mb-2"
            />
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="border p-1 w-full mb-4"  
            />
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Description"
              className="border p-1 w-full mb-4 resize-none h-20"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-2 py-1 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleAddEvent} className="px-2 py-1 bg-blue-500 text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}

      {viewingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-80">
            <h2 className="text-lg font-semibold mb-2">{viewingEvent.title}</h2>
            <p className="text-sm mb-1">
              <strong>Date:</strong> {format(parseISO(viewingEvent.date), 'PPP')}
            </p>
            <p className="text-sm mb-1">
              <strong>Time:</strong> {format(parseISO(viewingEvent.date), 'HH:mm')}
            </p>
            {viewingEvent.description && (
              <p className="text-sm mb-3 whitespace-pre-wrap">
                <strong>Description:</strong> {viewingEvent.description}
              </p>
            )}
            <div className="flex justify-end">
              <button onClick={() => setViewingEvent(null)} className="px-3 py-1 bg-gray-300 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
