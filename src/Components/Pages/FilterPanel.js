import React, { useState } from "react";
import style from "./FilterPanel.scss";
import Select from "react-select";
import DatePicker from "react-datepicker";
import customStyle from "./CustomDateStyle.css";

function FilterPanel({
    users,
    setUserFilterTests,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter
}) {
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
        setUserFilterTests(userTests);
    };

    const handleStartDateChange = value => {
        setStartDateFilter(value);
    };

    const handleEndDateChange = value => {
        setEndDateFilter(value);
    };

    const dateFormat = "ddd - DD/MM/YY";
    return (
        <div className={style["container"]}>
            <div>{""}</div>
            <div className={style["filters"]}>
                <div className={style["date-range"]}>
                    <div>
                        <DatePicker
                            className={style["date"]}
                            dateFormat={dateFormat}
                            selected={startDateFilter}
                            selectsStart={true}
                            startDate={startDateFilter}
                            endDate={endDateFilter}
                            maxDate={endDateFilter || undefined}
                            onChange={handleStartDateChange}
                            isClearable={true}
                        />
                        <div className={style["label"]}>Start Date</div>
                    </div>
                    <div>
                        <DatePicker
                            className={style["date"]}
                            dateFormat={dateFormat}
                            selected={endDateFilter}
                            selectsEnd={true}
                            startDate={startDateFilter}
                            endDate={endDateFilter}
                            minDate={startDateFilter || undefined}
                            onChange={handleEndDateChange}
                            isClearable={true}
                        />
                        <div className={style["label"]}>End Date</div>
                    </div>
                </div>
                <div>
                    <Select
                        className={style["select"]}
                        isMulti={true}
                        options={selectOptions}
                        onChange={handleNameFilterChange}
                    />

                    <div className={style["big-label"]}>User Filter</div>
                </div>
            </div>
        </div>
    );
}

export default FilterPanel;
