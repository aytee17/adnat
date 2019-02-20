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

export function getHoursWorked(startTime, endTime, breakLength) {
    let hoursWorked = (
        absTimeDiff(startTime, endTime) / 60 -
        breakLength / 60
    ).toFixed(2);

    const [first, second] = hoursWorked.split(".");
    if (second === "00") {
        hoursWorked = first;
    }
    return hoursWorked;
}

export function getShiftCost(hoursWorked, hourlyRate) {
    const shiftCost = parseFloat(hoursWorked) * parseFloat(hourlyRate);
    return shiftCost.toFixed(2);
}

export function getTime(date) {
    return new Date(date).getTime();
}
