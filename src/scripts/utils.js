
export function convertSecondsToMinutes(secs) {
    const mins = Math.floor(secs / 60);
    const remainingSeconds = Math.floor(secs % 60);

    // Pad minutes and seconds with leading zeros if necessary
    const minutes = mins.toString().padStart(0, '0');
    const seconds = remainingSeconds.toString().padStart(2, '0');

    return {minutes,seconds};
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
