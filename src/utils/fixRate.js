export default function fixRate(value) {
    value = value.toString();
    if (value === "") return value;

    const second = value.split(".")[1];
    if (second === undefined) {
        value = `${value}.00`;
    } else if (second === "") {
        value = `${value}00`;
    } else if (second.length === 1) {
        value = `${value}0`;
    }
    return value;
}
