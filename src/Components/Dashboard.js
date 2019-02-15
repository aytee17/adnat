import React, { useState, useEffect } from "react";
import style from "./Dashboard.scss";
import classnames from "classnames";
import { api } from "../utils/api";
import mapKeys from "lodash.mapkeys";

import Button from "./Controls/Button";
import CreateOrgForm from "./Forms/CreateOrgForm";

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
                        <CreateOrgForm
                            formOpened={formOpened}
                            setUser={setUser}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <h2>{myOrg.name}</h2>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
