import React, { useState, useEffect, Fragment } from 'react';
import useGlobalState from "../hooks/useGlobalState";
import axios from 'axios';
import Spinner from '../containers/Spinner';

const Logout = () => {

    const globalState = useGlobalState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const performLogout = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/logout`, {}, {
                    withCredentials: true
                });
                if(response.data.success){
                    globalState.setAuth('');
                }
            } catch(err){
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        performLogout();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(isLoading){
        return (
            <div className="container mt-4 text-center">
              <Spinner />
            </div>
        )
    }

    return (
        <div className="container mt-4">
            {error ? (
                <Fragment>
                    <div className="alert alert-dismissible alert-danger">
                        <button type="button" className="close" data-dismiss="alert">&times;</button>
                        {error}
                    </div>
                    <h3 className="text-center mt-2">Unable to logout</h3>
                </Fragment>
            ) : (
                <h3 className="text-center">You are now logged out</h3>
            )}
        </div>
    )
}

export default Logout;
