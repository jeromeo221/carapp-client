import React, { useState, useRef } from 'react';
import axios from 'axios';

const Signup = (props) => {
    const [error, setError] = useState(null);

    //Signup fields
    const emailField = useRef(null);
    const nameField = useRef(null);
    const passwordField = useRef(null);
    const passwordField2 = useRef(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const email = emailField.current.value;
            const name = nameField.current.value;
            const password = passwordField.current.value;
            const password2 = passwordField2.current.value;

            if(!email) throw new Error('Email is required');
            if(!name) throw new Error('Name is required');
            if(!password || !password2) throw new Error('Password is required');
            if(password !== password2) throw new Error('Password should match');

            const response = await axios.post(process.env.REACT_APP_BACKEND_ENDPOINT + `/signup`, {
                email,
                name,
                password,
                password2
            });
            if(response.data.success){
                props.history.push('/login?signup=true');
            } else {
                throw new Error(response.data.error);
            }
        } catch(err){
            setError(err.message);
        }
    }

    const handleClear = (e) => {
        e.preventDefault();
        nameField.current.value = '';
        emailField.current.value = '';
        passwordField.current.value = '';
        passwordField2.current.value = '';
    }

    return (
        <div className="container mt-4">
            {error ?
            (<div className="alert alert-dismissible alert-danger">
                <button type="button" className="close" data-dismiss="alert">&times;</button>
                {error}
            </div>) : null}
            <h2 className="text-center">Signup</h2>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label htmlFor="inputEmail">Email</label>
                    <input type="text" className="form-control" ref={emailField} id="inputEmail" placeholder="Enter Email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputName">Name</label>
                    <input type="text" className="form-control" ref={nameField} id="inputName" placeholder="Enter Name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword">Password</label>
                    <input type="password" className="form-control" ref={passwordField} id="inputPassword" placeholder="Enter Password"/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword2">Confirm Password</label>
                    <input type="password" className="form-control" ref={passwordField2} id="inputPassword2" placeholder="Confirm Password"/>
                </div>
                <button className="btn btn-primary" type="submit">Signup</button>
                <button className="btn btn-primary" onClick={handleClear}>Clear</button>
            </form>
        </div>
    )
}

export default Signup;