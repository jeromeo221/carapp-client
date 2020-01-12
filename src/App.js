import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Vehicle from './components/Vehicle';
import VehicleMaint from './components/VehicleMaint';
import About from './components/About';
import NotFound from './components/NotFound';
import './bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route exact path='/about' component={About} />
          <Route exact path='/vehicles/add' component={VehicleMaint} />
          <Route exact path='/vehicles/:id' component={Vehicle} />
          <Route exact path='/vehicles/:id/update' component={VehicleMaint} />
          <Route path="*" component={NotFound} /> 
        </Switch>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
