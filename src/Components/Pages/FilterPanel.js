import React from "react";
import style from "./FilterPanel.scss";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";

function FilterPanel({ users, setUserFilterTests, setDateRange }) {
    const selectOptions = [];
    for (let key in users) {
        const { id, name } = users[key];
        selectOptions.push({ value: id, label: name });
    }

    const handleNameFilterChange = selectedOptions => {
        // For each selected user, create a function that tests if a shift belongs to that user
        const userTests = selectedOptions.map(option => {
            return function userTest(shift) {
                return shift.userId === option.value;
            };
        });
        console.log(userTests);
        setUserFilterTests(userTests);
    };

    return (
        <div className={style["container"]}>
            <Select
                className={style["select"]}
                isMulti={true}
                options={selectOptions}
                onChange={handleNameFilterChange}
            />
        </div>
    );
}

export default FilterPanel;
