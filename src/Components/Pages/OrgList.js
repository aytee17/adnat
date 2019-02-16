import React, { useState } from "react";
import style from "./OrgList.scss";
import Input from "../Controls/Input";
import { FilterIcon } from "../Icons/Icons";

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

    const noResults =
        filter !== "" &&
        Object.keys(organisations).length > 0 &&
        orgs.length === 0;

    const noOrganisations = organisations.length === 0;

    return (
        <div className={style["container"]}>
            <div className={style["header"]}>
                <div>Organisations</div>
                <Input
                    name="filter"
                    label="Filter"
                    onChange={e => setFilter(e.target.value)}
                    value={filter}
                    icon={true}
                    small={true}
                >
                    <FilterIcon />
                </Input>
            </div>
            <div className={style["list"]}>
                {noResults ? (
                    <div className={style["no-results"]}>No results</div>
                ) : (
                    orgs.map((org, index) => {
                        return (
                            <div key={index} className={style["item"]}>
                                {org.name}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default OrgList;
