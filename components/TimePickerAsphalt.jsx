import React, { useState, useRef, useEffect } from 'react';

export default function ResponsiveTimePickers({ initialTime, onTimeChange }) {
    const [hour, setHour] = useState(initialTime.split(':')[0]);
    const [minute, setMinute] = useState(initialTime.split(':')[1].split(' ')[0]);
    const [ampm, setAmpm] = useState(initialTime.split(' ')[1]);
    const [showDropdowns, setShowDropdowns] = useState(false);
    const timePickerRef = useRef(null);

    const updateTime = (newHour, newMinute, newAmpm) => {
        const newTime = `${newHour}:${newMinute} ${newAmpm}`;
        onTimeChange(newTime);
    };

    useEffect(() => {
        updateTime(hour, minute, ampm);
    }, [hour, minute, ampm]);

    const handleHourChange = (e) => setHour(e.target.value);
    const handleMinuteChange = (e) => setMinute(e.target.value);
    const handleAmpmChange = (e) => setAmpm(e.target.value);

    const toggleDropdowns = () => setShowDropdowns(!showDropdowns);

    const handleClickOutside = (event) => {
        if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
            setShowDropdowns(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className=" bg-black" ref={timePickerRef}>
            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
                </svg>
            </div>
            <input type="text" value={`${hour}:${minute} ${ampm}`} readOnly onClick={toggleDropdowns} className="cursor-pointer border border-gray-300 rounded-s text-black w-full"></input>
            
            
            {showDropdowns && (
                <div className="absolute mt-1 bg-white border border-gray-300 rounded shadow-md p-2 flex space-x-2 text-black">
                    <select value={hour} onChange={handleHourChange} className="p-1 border border-gray-300 rounded text-black">
                        {[...Array(12).keys()].map((h) => (
                            <option key={h + 1} value={h + 1}>
                                {h + 1}
                            </option>
                        ))}
                    </select>
                    <select value={minute} onChange={handleMinuteChange} className="p-1 border border-gray-300 rounded">
                        <option value="00">00</option>
                        <option value="30">30</option>
                    </select>
                    <select value={ampm} onChange={handleAmpmChange} className="p-1 border border-gray-300 rounded">
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            )}
        </div>
    );
}
