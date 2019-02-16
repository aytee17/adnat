import React, { useState } from "react";
import style from "./OrgList.scss";
import Input from "../Controls/Input";

function OrgList({ organisations }) {
    const [filter, setFilter] = useState("");
    const orgs = [];
    for (let key in organisations) {
        let org = organisations[key];
        let containsFilter =
            org.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
        if (filter !== "" && containsFilter) {
            orgs.push(org);
        } else if (filter === "") {
            orgs.push(org);
        }
    }
    return (
        <div className={style["container"]}>
            <div className={style["header"]}>
                <div>Organisations</div>
                <Input
                    style={{ height: "30px" }}
                    name="filter"
                    label="Filter"
                    onChange={e => setFilter(e.target.value)}
                    value={filter}
                />
            </div>
            <div className={style["list"]}>
                {orgs.map((org, index) => {
                    return (
                        <div key={index} className={style["item"]}>
                            {org.name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default OrgList;
