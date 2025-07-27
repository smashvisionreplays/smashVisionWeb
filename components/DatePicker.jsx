import Datepicker from "tailwind-datepicker-react"
import { useState } from "react"
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline' 
import { Label, Listbox  } from '@headlessui/react'
const todayDate=new Date();
let day = todayDate.getDate();
let month = todayDate.getMonth();
let year = todayDate.getFullYear();

var dateOffset = (24*60*60*1000) * 7; //7 days
let lastWeekDate=new Date();
lastWeekDate.setTime(todayDate.getTime()-dateOffset)
let last_week_day = lastWeekDate.getDate();
let last_week_month = lastWeekDate.getMonth();
let last_week_year = lastWeekDate.getFullYear();

console.log(`todays: ${todayDate}, ${day}, ${month}, ${year}, lastweeks ${lastWeekDate}, ${last_week_day}, ${last_week_month}, ${last_week_year},`)

const options = {
	autoHide: true,
	todayBtn: true,
	clearBtn: true,
	clearBtnText: "Clear",
	maxDate: new Date(year,month,day),
	minDate: new Date(last_week_year,last_week_month,last_week_day),
	theme: {
		background: "bg-gray-700 dark:bg-gray-800",
		todayBtn: "bg-blue-500",
		clearBtn: "",
		icons: "bg- text-white",
		text: "text-gray-100 hover:bg-gray-500",
		disabledText: "text-white text-opacity-20 hover:bg-red-500",
		input: "",
		inputIcon: "",
		selected: "",
	}, 
	icons: {
		// () => ReactElement | JSX.Element
		prev: () => <span className="hidden"><ArrowLeftIcon aria-hidden="true" className="size-6 group-data-[open]:block"/></span>,
		next: () => <span className="hidden"><ArrowRightIcon aria-hidden="true" className="size-6 group-data-[open]:block"/></span>,
	},
	datepickerClassNames: "top-12",
	defaultDate: new Date(year, month, day),
	language: "en",
	disabledDates: [],
	weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
	inputNameProp: "date",
	inputIdProp: "date",
	inputPlaceholderProp: "Select Date",
	inputDateFormatProp: {
		day: "numeric",
		month: "long",
		year: "numeric"
	},
}

export default function DatePicker({label, onSelect}){
	const [show, setShow] = useState(false)

	const handleChange = (selectedDate) => {
        console.log("In handle change", selectedDate)
        onSelect(selectedDate)
	}
	const handleClose = (state) => {
		setShow(state)
	}

	return (
		<div>
            <Listbox >
            <Label className="block text-sm/6 font-medium text-gray-400 mb-2">{label}</Label>
                <Datepicker options={options} onChange={handleChange} show={show} setShow={handleClose} />
            </Listbox>
            
		</div>
	)
}