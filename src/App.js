import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import useGlobalState from './hooks/useGlobalState';
import Spinner from './containers/Spinner';
import axios from 'axios';
import './bootstrap.min.css';
import Routes from './Routes';

const App = () => {

  const globalState = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const getAuthorizerToken = async () => {
          try {
              const response = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/refresh`, {}, {
                  withCredentials: true
              });
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

  if(isLoading){
    return (
      <div className="container mt-4 text-center">
        <Spinner />
      </div>
    )
  }

  return (
      <BrowserRouter>
        <div className="App">
            <Routes />
        </div>
      </BrowserRouter>
  );
}

export default App;
