import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

    const [token, setToken] = useState(null);

    const declareToken = (token) => {
        setToken(token);
    }

    return (  
        <AuthContext.Provider value={{token, declareToken}}>
            {props.children}
        </AuthContext.Provider>
    );
}
 
export default AuthContextProvider;