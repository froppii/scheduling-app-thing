import React, { useState } from 'react';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const TinyCalendar = () => {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = firstDayOfMonth.getDay();

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const isSameDay = (date1: Date, date2: Date) =>
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();

    const renderDays = () => {
        const days = [];

        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

        for (let i = startDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            days.push(
                <div
                    key={`prev-${day}`}
                    className="w-6 h-6 text-xs text-gray-500 flex items-center justify-center"
                >
                    {day}
                </div>
            );
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const thisDate = new Date(currentYear, currentMonth, d);
            const isSelected = isSameDay(thisDate, selectedDate);

            days.push(
                <button
                    key={d}
                    onClick={() => setSelectedDate(thisDate)}
                    className={`w-6 h-6 text-xs rounded flex items-center justify-center ${
                        isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-600'
                    }`}
                >
                    {d}
                </button>
            );
        }

        const totalCells = 42;
        const daysToAdd = totalCells - days.length;
        
        for (let i = 1; i <= daysToAdd; i++) {
            days.push(
                <div
                    key={`next-${i}`}
                    className="w-6 h-6 text-xs text-gray-500 flex items-center justify-center"
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="bg-gray-900 text-white p-2 text-center text-xs">
            <div className="flex justify-between items-center mb-2">
                <button onClick={handlePrevMonth} className="text-gray-400 hover:text-white">&lt;</button>
                <div>{`${today.toLocaleString('default', { month: 'short' })} ${currentYear}`}</div>
                <button onClick={handleNextMonth} className="text-gray-400 hover:text-white">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
                {daysOfWeek.map((day) => (
                    <div key={day} className="text-gray-400">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
        </div>
    );
};

export default TinyCalendar;