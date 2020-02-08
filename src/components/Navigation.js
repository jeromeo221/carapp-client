import React from 'react';
import { Link } from 'react-router-dom';
import useGlobalState from '../hooks/useGlobalState';

const Navigation = (props) => {
    const {token} = useGlobalState().auth;
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link to="/" className="navbar-brand">Carapp</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor02">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className="nav-link">About</Link>
                        </li>
                    </ul>
                    {token ? 
                    (<ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/logout" className="nav-link">Logout</Link>
                        </li>
                    </ul>)
                    : 
                    (<><ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/signup" className="nav-link">Signup</Link>
                        </li>
                    </ul></>)}
                </div>
            </nav>
        </div>
    )
}

export default Navigation;