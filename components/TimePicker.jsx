import React, { useState, useEffect } from "react";
import { Label, Listbox } from '@headlessui/react';
import ResponsiveTimePickers from './TimePickerAsphalt';

export default function TimePicker1({ label, onTimeSelect, onDurationSelect }) {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes() >= 30 ? '30' : '00';
    const currentAmpm = currentHour >= 12 ? 'PM' : 'AM';
    const formattedHour = currentHour % 12 || 12; // Convert to 12-hour format
    const initialTime = `${formattedHour}:${currentMinute} ${currentAmpm}`;

    const [selectedTime, setSelectedTime] = useState(initialTime);
    const [selectedDuration, setSelectedDuration] = useState("Duration");

    const handleDurationSelect = (duration) => {
        setSelectedDuration(duration);
    };

    useEffect(() => {
        onDurationSelect(selectedDuration);
    }, [selectedDuration]);

    useEffect(() => {
        onTimeSelect(selectedTime);
    }, [selectedTime]);

    return (
        <>
            <Listbox>
                <Label className=" block text-sm/6 font-medium text-gray-400 ">{label}</Label>
                <form className=" bg-blue-400">
                    <div className="flex bg-black">
                        <div className=" bg-none relative w-full">
                            
                            <ResponsiveTimePickers initialTime={initialTime} onTimeChange={setSelectedTime} />
                        </div>
                        <button
                            id="dropdown-duration-button"
                            data-dropdown-toggle="dropdown-duration"
                            className="border-s-0 flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e rounded-s-none hover:bg-gray-200 focus:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                            type="button"
                        >
                            {selectedDuration}
                            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                            </svg>
                        </button>
                        <div id="dropdown-duration" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-duration-button">
                                <li>
                                    <button type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleDurationSelect("30 minutes")}>
                                        30 minutes
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleDurationSelect("1 hour")}>
                                        1 hour
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleDurationSelect("2 hours")}>
                                        2 hours
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </form>
            </Listbox>
        </>
    );
}
