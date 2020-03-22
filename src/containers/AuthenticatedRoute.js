import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function AuthenticatedRoute({ component: C, ...rest }) {
    const {token} = useContext(AuthContext);
    
    return (
        <Route
            {...rest}
            render={props =>
                token
                ? <C {...props} />
                : <Redirect to={`/login?redirect=${props.location.pathname}${props.location.search}`}/>
        }
        />
    );
}