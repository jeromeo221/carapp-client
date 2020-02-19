import React from "react";
import { Route, Redirect } from "react-router-dom";
import useGlobalState from '../hooks/useGlobalState';

export default function AuthenticatedRoute({ component: C, ...rest }) {
    const {token} = useGlobalState().auth;
    
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