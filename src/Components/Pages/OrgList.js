import React, { useState, useRef } from "react";
import style from "./OrgList.scss";
import classnames from "classnames";
import OrgForm from "../Forms/OrgForm";
import Input from "../Controls/Input";
import { FilterIcon } from "../Icons/Icons";
import { api } from "../../utils/api";
import { UPDATE } from "../../enums/enum";

function OrgList({ organisations, setOrganisations, updateUser }) {
    const join = organisationId => () => {
        api.post("/organisations/join", { organisationId }).then(response => {
            if (organisationId === response.data.id) {
                updateUser({ organisationId });
            }
        });
    };

    const [filter, setFilter] = useState("");
    const [editing, setEditing] = useState(-1);
    const updateEditing = organisationId => () => setEditing(organisationId);

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

    const formRef = useRef();

    function renderList() {
        return orgs.map(org => {
            const currentlyEditing = org.id === editing;
            const itemClassName = classnames(style["item"], {
                [style["editing"]]: currentlyEditing
            });
            const nameClassName = classnames(style["name"], {
                [style["center-name"]]: currentlyEditing
            });
            return (
                <div key={org.id} className={itemClassName}>
                    <div className={nameClassName}>
                        {`${org.name} ${
                            currentlyEditing ? ` | $${org.hourlyRate}/hour` : ""
                        }`}
                    </div>
                    {currentlyEditing ? (
                        <div
                            key={org.id}
                            style={{
                                width: "350px",
                                margin: "0 auto",
                                marginBottom: "15px"
                            }}
                        >
                            <OrgForm
                                ref={formRef}
                                org={org}
                                mode={UPDATE}
                                resetEditing={() => {
                                    setEditing(-1);
                                }}
                                formOpened={true}
                                organisations={organisations}
                                setOrganisations={setOrganisations}
                            />
                        </div>
                    ) : (
                        <div className={style["controls"]}>
                            <div
                                className={style["control-item"]}
                                onClick={updateEditing(org.id)}
                            >
                                Edit
                            </div>
                            <div
                                className={style["control-item"]}
                                onClick={join(org.id)}
                            >
                                Join
                            </div>
                        </div>
                    )}
                </div>
            );
        });
    }

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
                    renderList()
                )}
            </div>
        </div>
    );
}

export default OrgList;
