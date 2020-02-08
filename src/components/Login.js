import React, {useState} from "react";
import axios from 'axios';
import useGlobalState from "../hooks/useGlobalState";

const Login = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState(null);
    const globalState = useGlobalState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT}/login`, {
            //     method: 'POST',
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     credentials: 'include',
            //     body: JSON.stringify({
            //         email,
            //         password
            //     })
            // }).then((response) => {
            //     console.log(response);
            // }).then((data) => {
            //     console.log(data);
            // })
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/login`, {
                email,
                password
            }, {
                withCredentials: true
            });
            console.log(response);
            if(response.data.success){
                globalState.setAuth({token: response.data.data.token});
                props.history.push('/');
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
        <div>
            {displayForm()}
        </div>        
    )
}

export default Login;