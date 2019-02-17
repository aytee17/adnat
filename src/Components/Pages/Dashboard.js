import React, { useState, useEffect } from "react";
import style from "./Dashboard.scss";
import classnames from "classnames";
import { api } from "../../utils/api";
import mapKeys from "lodash.mapkeys";

import OrgList from "./OrgList";
import Button from "../Controls/Button";
import OrgForm from "../Forms/OrgForm";
import useClickOutside from "../Hooks/useClickOutside";
import { CREATE, UPDATE } from "../../enums/enum";
import fixRate from "../../utils/fixRate";

function Dashboard({ user, updateUser }) {
    const [createFormRef, createFormOpened, toggleCreateForm] = useClickOutside(
        false
    );
    const [updateFormRef, updateFormOpened, toggleUpdateForm] = useClickOutside(
        false
    );

    const [organisations, setOrganisations] = useState({ loaded: false });
    useEffect(() => {
        api.get("/organisations").then(response => {
            setOrganisations(transformOrgData(response.data));
        });
    }, []);

    function transformOrgData(orgs) {
        orgs = orgs.map(org => ({
            ...org,
            hourlyRate: fixRate(org.hourlyRate)
        }));
        orgs = mapKeys(orgs, "id");
        return orgs;
    }

    function leaveOrg() {
        api.post("/organisations/leave").then(response => {
            console.log("leave", { response });
            if (response.data === "OK") {
                updateUser({ organisationId: null });
            }
        });
    }

    // Don't render if user or orgs not loaded yet
    if (user.loaded === false || organisations.loaded === false) {
        return <div />;
    }

    const { name, organisationId } = user;
    const myOrg = organisations[organisationId];

    const classNameForEdit = classnames(style["controls"], {
        [style["active"]]: updateFormOpened
    });
    return (
        <div className={style["container"]}>
            <div className={style["greeting"]}>Hi, {name}!</div>
            {organisationId === null ? (
                <div>
                    <div>
                        You aren't a member of any organisations. Join an
                        existing one or create a new one.
                    </div>
                    <div className={style["horizontal"]}>
                        <OrgList
                            organisations={organisations}
                            setOrganisations={setOrganisations}
                            updateUser={updateUser}
                        />
                        <div className={style["create-form"]}>
                            <Button
                                style={{ width: "200px" }}
                                active={createFormOpened}
                                onClick={toggleCreateForm}
                            >
                                Create Organisation
                            </Button>
                            <OrgForm
                                ref={createFormRef}
                                formOpened={createFormOpened}
                                toggleForm={toggleCreateForm}
                                updateUser={updateUser}
                                organisations={organisations}
                                setOrganisations={setOrganisations}
                                mode={CREATE}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className={style["header"]}>
                        <div className={style["org-name"]}>
                            {myOrg.name}
                            <div className={style["rate"]}>
                                {`Rate: $${myOrg.hourlyRate} / hour`}
                            </div>
                        </div>
                        <div
                            className={classNameForEdit}
                            onClick={toggleUpdateForm}
                        >
                            <div>{`Edit${updateFormOpened ? "ing" : ""}`}</div>
                        </div>
                        <div className={style["controls"]} onClick={leaveOrg}>
                            Leave
                        </div>
                    </div>
                    <OrgForm
                        ref={updateFormRef}
                        formOpened={updateFormOpened}
                        toggleForm={toggleUpdateForm}
                        org={myOrg}
                        organisations={organisations}
                        setOrganisations={setOrganisations}
                        mode={UPDATE}
                    />
                </>
            )}
        </div>
    );
}

export default Dashboard;
