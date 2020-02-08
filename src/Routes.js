import React, { useEffect, useState, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Vehicle from './components/Vehicle';
import VehicleMaint from './components/VehicleMaint';
import About from './components/About';
import NotFound from './components/NotFound';
import Login from './components/Login';
import AuthenticatedRoute from './containers/AuthenticatedRoute';
import useGlobalState from './hooks/useGlobalState';
import Spinner from './containers/Spinner';

const Routes = () => {

    const globalState = useGlobalState();
    const [isloading, setIsLoading] = useState(false);

    useEffect(() => {
        const getAuthorizerToken = async () => {
            try {
                console.log('....refreshing');
                setIsLoading(true);
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/refresh`, {}, {
                    withCredentials: true
                });
                console.log(response);
                if(response.data.success){
                    globalState.setAuth({token: response.data.data.token});
                }
            } catch(err){
                 console.log(err.message);
                //Ignore the errors, meaning user is not logged in
            } finally {
                setIsLoading(false);
            }
        }
        getAuthorizerToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(isloading){
        return (
            <div className="container mt-4 text-center">
                <Spinner />
            </div>
        )
    }

    return (
        <Fragment>
            <Navigation/>
            <Switch>
                <AuthenticatedRoute exact path='/' component={Dashboard} />
                <Route exact path='/about' component={About} />
                <Route exact path='/login' component={Login} />
                <AuthenticatedRoute exact path='/vehicles/add' component={VehicleMaint} />
                <AuthenticatedRoute exact path='/vehicles/:id' component={Vehicle} />
                <AuthenticatedRoute exact path='/vehicles/:id/update' component={VehicleMaint} />
                <Route path="*" component={NotFound} /> 
            </Switch>
        </Fragment>
    )
}

export default Routes;