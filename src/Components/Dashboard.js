import React, { useState, useEffect } from "react";
import style from "./Dashboard.scss";
import { api } from "../utils/api";
import mapKeys from "lodash.mapkeys";

import Button from "./Controls/Button";
import OrgForm from "./Forms/OrgForm";
import { EditIcon } from "./Icons/Icons";

function Dashboard({ user, setUser }) {
    const { name, organisationId } = user;

    const [formOpened, setFormOpened] = useState(false);
    const [organisations, setOrganisations] = useState({ loaded: false });

    useEffect(() => {
        api.get("/organisations").then(response => {
            setOrganisations(mapKeys(response.data, "id"));
        });
    }, [user]);

    function toggleForm() {
        setFormOpened(!formOpened);
    }

    const myOrg = organisations[organisationId];

    if (user.loaded === false || organisations.loaded === false) {
        return <div />;
    }
    return (
        <div className={style["container"]}>
            <div className={style["greeting"]}>Hi, {name}!</div>
            {organisationId === null ? (
                <div>
                    <div>
                        You aren't a member of any organisations. Join an
                        existing one or create a new one.
                    </div>
                    <div className={style["create-form"]}>
                        <Button
                            style={{ width: "200px" }}
                            active={formOpened}
                            onClick={toggleForm}
                        >
                            Create Organisation
                        </Button>
                        <OrgForm formOpened={formOpened} setUser={setUser} />
                    </div>
                </div>
            ) : (
                <div className={style["header"]}>
                    <div className={style["org-name"]}>
                        {myOrg.name}
                        <div className={style["rate"]}>
                            {`Rate: $${myOrg.hourlyRate} / hour`}
                        </div>
                    </div>
                    <div className={style["controls"]}>
                        <div>Edit</div>
                    </div>
                    <div className={style["controls"]}>Leave</div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
