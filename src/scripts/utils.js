
export function convertSecondsToMinutes(secs) {
    const mins = Math.floor(secs / 60);
    const remainingSeconds = Math.floor(secs % 60);

    // Pad minutes and seconds with leading zeros if necessary
    const minutes = mins.toString().padStart(0, '0');
    const seconds = remainingSeconds.toString().padStart(2, '0');

    return {minutes,seconds};
}

export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Videos are addressed by weekday within a rolling 7-day window, so a weekday
// only orders correctly relative to today. Maps each weekday to 0–6 where the
// oldest available day (7 days ago) = 0 and today = 6.
export function getWeekdaySortKey(weekday, today = new Date()) {
    const idx = WEEKDAY_NAMES.indexOf(weekday);
    if (idx === -1) return -1;
    return ((idx - today.getDay() - 1 + 7) % 7);
}

// A video is addressed by (club, court, weekday, hour, hour_section), so those
// five values are all a /videoView URL needs to be shareable. The Cloudflare uid
// is deliberately left out: it is looked up from this address instead.
export function buildVideoViewSearch({ id_club, court_number, weekday, hour, section }) {
    const params = new URLSearchParams();
    params.set('club', String(id_club));
    params.set('court', String(court_number));
    params.set('weekday', weekday);
    params.set('hour', String(hour));
    params.set('section', String(section));
    return params.toString();
}

// Identifies the slot a set of video parameters points at, for comparing an
// address that arrived through the URL with one that arrived through state.
export function getVideoSlotKey({ id_club, court_number, weekday, hour, section } = {}) {
    return `${id_club}|${court_number}|${weekday}|${Number(hour)}|${Number(section)}`;
}

// Returns null when the URL does not carry a complete, valid video address.
export function parseVideoViewSearch(search) {
    const params = new URLSearchParams(search);
    const club = Number(params.get('club'));
    const court = Number(params.get('court'));
    const hour = Number(params.get('hour'));
    const section = Number(params.get('section'));
    const weekday = params.get('weekday');

    const isFilled = ['club', 'court', 'weekday', 'hour', 'section'].every(key => params.get(key) !== null && params.get(key) !== '');
    if (!isFilled) return null;
    if ([club, court, hour, section].some(value => !Number.isFinite(value))) return null;
    if (!WEEKDAY_NAMES.includes(weekday)) return null;
    if (hour < 0 || hour > 23 || (section !== 0 && section !== 1)) return null;

    return {
        id_club: club,
        court_number: court,
        weekday,
        hour,
        section,
    };
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
