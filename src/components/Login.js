import React, {useState} from "react";
import axios from 'axios';
import useGlobalState from "../hooks/useGlobalState";
import queryString from 'query-string';

const Login = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState(null);
    const globalState = useGlobalState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/login`, {
                email,
                password
            }, {
                withCredentials: true
            });
            if(response.data.success){
                globalState.setAuth({token: response.data.data.token});
                const parsed = queryString.parse(props.location.search);
                if(parsed.redirect){
                    props.history.push(parsed.redirect);
                } else {
                    props.history.push('/');
                }                
            } else {
                throw new Error(response.data.error);
            }
        } catch(err){
            setErrors(err.message);
        }
    }

    const displayForm = () => {
        return (
            <div className="container mt-4">
                {errors &&
                <div className="alert alert-dismissible alert-danger">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    {errors}
                </div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="inputEmail">Email</label>
                        <input type="text" className="form-control" id="inputEmail" placeholder="Enter Email" 
                            value={email || ''} 
                            onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputPassword">Password</label>
                        <input type="password" className="form-control" id="inputPassword" placeholder="Enter Password" 
                            value={password || ''} 
                            onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <button className="btn btn-primary" type="submit">Login</button>
                </form>
            </div>
        )
    }

    return (
        <div className="mt-4">
            <h2 className="text-center">Login</h2>
            {displayForm()}
        </div>        
    )
}

export default Login;