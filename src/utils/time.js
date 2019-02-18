export function convertToMinutes(time) {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    minutes = minutes + hours * 60;
    return minutes;
}

export function absTimeDiff(start, end) {
    start = convertToMinutes(start);
    end = convertToMinutes(end);

    if (start > end) {
        return 24 * 60 - start + end;
    }
    return end - start;
}
