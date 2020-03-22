import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './bootstrap.min.css';
import Routes from './Routes';
import { AuthContext } from './contexts/AuthContext';
import Spinner from './containers/Spinner';
import axios from 'axios';

class App extends Component {
  static contextType = AuthContext;

  state = {
    isLoading: true
  }

  componentDidMount(){    
    const getAuthorizerToken = async () => {
      const {declareToken} = this.context;
      try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/refresh`, {}, {
              withCredentials: true
          });
          if(response.data.success){
              declareToken(response.data.data.token);
          }
      } catch(err){
          console.log(err.message);
          //Ignore the errors, meaning user is not logged in
      } finally {
          this.setState({isLoading: false});
      }
    }
    getAuthorizerToken();
  }

  render(){
    if(this.state.isLoading){
      return (
        <div className="container mt-4 text-center">
          <Spinner />
        </div>
      )
    } else {
      return (
        <BrowserRouter>
          <div className="App">
              <Routes />
          </div>
        </BrowserRouter>
      );
    }
  }  
}

export default App;
