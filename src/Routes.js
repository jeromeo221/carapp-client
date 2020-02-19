import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Vehicle from './components/Vehicle';
import VehicleMaint from './components/VehicleMaint';
import About from './components/About';
import NotFound from './components/NotFound';
import Login from './components/Login';
import AuthenticatedRoute from './containers/AuthenticatedRoute';
import Logout from './components/Logout';
import User from './components/User';
import Signup from './components/Signup';

const Routes = () => {

    return (
        <Fragment>
            <Navigation/>
            <Switch>
                <AuthenticatedRoute exact path='/' component={Dashboard} />
                <Route exact path='/about' component={About} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/logout' component={Logout} />
                <Route exact path='/signup' component={Signup} />
                <AuthenticatedRoute exact path='/user' component={User} />
                <AuthenticatedRoute exact path='/vehicles/add' component={VehicleMaint} />
                <AuthenticatedRoute exact path='/vehicles/:id' component={Vehicle} />
                <AuthenticatedRoute exact path='/vehicles/:id/update' component={VehicleMaint} />
                <Route path="*" component={NotFound} /> 
            </Switch>
        </Fragment>
    )
}

export default Routes;