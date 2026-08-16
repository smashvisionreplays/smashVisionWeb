
export function convertSecondsToMinutes(secs) {
    const mins = Math.floor(secs / 60);
    const remainingSeconds = Math.floor(secs % 60);

    // Pad minutes and seconds with leading zeros if necessary
    const minutes = mins.toString().padStart(0, '0');
    const seconds = remainingSeconds.toString().padStart(2, '0');

    return {minutes,seconds};
}

// Videos are addressed by weekday within a rolling 7-day window, so a weekday
// only orders correctly relative to today. Maps each weekday to 0–6 where the
// oldest available day (7 days ago) = 0 and today = 6.
export function getWeekdaySortKey(weekday, today = new Date()) {
    const weekdayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const idx = weekdayOrder.indexOf(weekday);
    if (idx === -1) return -1;
    return ((idx - today.getDay() - 1 + 7) % 7);
}

//function for best moments
export function getVideoSeekTime(selectedTime, startRecordingTime) {
    const toSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const selectedSeconds = toSeconds(selectedTime);
    const startSeconds = toSeconds(startRecordingTime);

    return selectedSeconds - startSeconds;
}
