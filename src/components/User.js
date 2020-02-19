import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../containers/Spinner';
import axios from 'axios';
import useGlobalState from '../hooks/useGlobalState';
import jwt from 'jsonwebtoken';

const User = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    //const [userData, setUserData] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const {token} = useGlobalState().auth;

    //Change User fields
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);

    //Change password fields
    const oldPasswordField = useRef(null);
    const newPasswordField = useRef(null);
    const newPasswordField2 = useRef(null);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                //decode the token
                const decoded = jwt.decode(token);
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_ENDPOINT}/user/${decoded.payload.userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.success){
                    setName(response.data.data.name);
                    setEmail(response.data.data.email);
                } else {
                    throw new Error(response.data.error);
                }
            } catch (err){
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        if(token) getUserDetails();
    }, [token]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const oldPassword = oldPasswordField.current.value;
            const newPassword = newPasswordField.current.value;
            const newPassword2 = newPasswordField2.current.value;

            if(!token) return;
            if(!oldPassword) throw new Error('Old Password is required');
            if(!newPassword || !newPassword2) throw new Error('New Password is required');
            if(newPassword !== newPassword2) throw new Error('Password should match');
            
            const data = {
                oldPassword,
                password: newPassword,
                password2: newPassword2
            }
            const decoded = jwt.decode(token);
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_ENDPOINT}/user/${decoded.payload.userId}/changepwd`, {data}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data.success){
                setPasswordSuccess('Password Successfully Changed!');
                setPasswordError(null);
            } else {
                throw new Error(response.data.error);
            }
        } catch (err){
            setPasswordError(err.message);
        } finally {
            oldPasswordField.current.value = '';
            newPasswordField.current.value = '';
            newPasswordField2.current.value = '';
        }
    }

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            if(!token) return;
            const data = {
                name,
                email
            }
            const decoded = jwt.decode(token);
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_ENDPOINT}/user/${decoded.payload.userId}`, {data}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data.success){
                setError(null);
            } else {
                throw new Error(response.data.error);
            }
        } catch(err){
            setError(err.message);
        } finally {
            setEditMode(false);
        }        
    }

    if(isLoading){
        return (
            <div className="container mt-4 text-center">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="container mt-4">
            {error ? (<div className="alert alert-dismissible alert-danger">
                {error}
            </div>) : null}
            {editMode ? (
                <div>
                    <form onSubmit={handleEditUser}>
                        <div className="form-group" style={{width: '30%'}}>
                            <label htmlFor="inputName">Name</label>
                            <input type="text" className="form-control form-control-sm" id="inputName" placeholder="Enter Name" 
                                value={name || ''} 
                                onChange={e => setName(e.target.value)}/>
                            <label htmlFor="inputEmail">Email</label>
                            <input type="text" className="form-control form-control-sm" id="inputEmail" placeholder="Enter Email" 
                                value={email || ''} 
                                onChange={e => setEmail(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm">Save</button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Welcome <b>{name}</b></h2>
                    <h6>Your email is {email}</h6>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditMode(true)}>Edit</button>
                </div>
            )}            
            <div className="mt-4">
                <h3>Change Password</h3>
                {passwordError ? (<div className="alert alert-danger">
                    {passwordError}
                </div>) : null}
                {passwordSuccess ? (<div className="alert alert-dismissible alert-success">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    {passwordSuccess}
                </div>) : null}
                <form onSubmit={handleChangePassword} style={{width: '30%'}}>
                    <div className="form-group">
                        <input type="password" className="form-control form-control-sm" ref={oldPasswordField} id="inputOldPassword" placeholder="Enter Old Password"/>
                        <input type="password" className="form-control form-control-sm mt-2" ref={newPasswordField} id="inputNewPassword" placeholder="Enter New Password" />
                        <input type="password" className="form-control form-control-sm mt-2" ref={newPasswordField2} id="inputNewPassword2" placeholder="Confirm New Password" />
                    </div>
                    <button className="btn btn-primary" type="submit">Change</button>
                </form>
            </div>
        </div>
    )
}

export default User;