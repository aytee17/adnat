import React, { useState } from "react";
import style from "./OrgList.scss";
import Input from "../Controls/Input";
import { FilterIcon } from "../Icons/Icons";
import { api } from "../../utils/api";

function OrgList({ organisations, updateUser }) {
    function join(organisationId) {
        return () => {
            api.post("/organisations/join", { organisationId }).then(
                response => {
                    if (organisationId === response.data.id) {
                        updateUser({ organisationId });
                    }
                }
            );
        };
    }

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
            {noOrganisations && (
                <div classname={style["no-orgs"]}>
                    There are no organisations to show.
                </div>
            )}
            <div className={style["list"]}>
                {noResults ? (
                    <div className={style["no-results"]}>No results</div>
                ) : (
                    orgs.map((org, index) => {
                        return (
                            <div key={index} className={style["item"]}>
                                <div>{org.name}</div>
                                <div className={style["controls"]}>
                                    <div className={style["control-item"]}>
                                        Edit
                                    </div>
                                    <div
                                        className={style["control-item"]}
                                        onClick={join(org.id)}
                                    >
                                        Join
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default OrgList;
