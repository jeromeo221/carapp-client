import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './bootstrap.min.css';
import { GlobalStateProvider } from './hooks/useGlobalState';
import Routes from './Routes';

const App = () => {

  return (
      <BrowserRouter>
        <div className="App">
          <GlobalStateProvider>
            <Routes/>
          </GlobalStateProvider>
        </div>
      </BrowserRouter>
  );
}

export default App;
