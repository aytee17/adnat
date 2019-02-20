import moment from "moment";

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

export function getShiftCost(
    startDate,
    endDate,
    startTime,
    endTime,
    hourlyRate,
    breakLength,
    hoursWorked
) {
    let shiftCost;
    const startDay = moment(startDate).day();
    const endDay = moment(endDate).day();
    const startOnSunday = startDay === 0;
    const endOnSunday = endDay == 0;

    let hoursFirstDay = 24 - convertToMinutes(startTime) / 60;
    let hoursSecondDay = convertToMinutes(endTime) / 60;
    const breakHours = breakLength / 60;

    if (hoursSecondDay - breakHours <= 0) {
        hoursFirstDay = hoursFirstDay + (hoursSecondDay - breakHours);
        hoursSecondDay = 0;
    } else {
        hoursSecondDay = hoursSecondDay - breakHours;
    }

    if (startOnSunday && endOnSunday) {
        shiftCost = parseFloat(hoursWorked) * parseFloat(hourlyRate) * 2;
    } else if (endOnSunday) {
        shiftCost =
            (2 * hoursSecondDay + hoursFirstDay) * parseFloat(hourlyRate);
    } else if (startOnSunday) {
        shiftCost =
            (2 * hoursFirstDay + hoursFirstDay) * parseFloat(hourlyRate);
    } else {
        shiftCost = parseFloat(hoursWorked) * parseFloat(hourlyRate);
    }

    return shiftCost.toFixed(2);
}

export function getTime(date) {
    return new Date(date).getTime();
}
