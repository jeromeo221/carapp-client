import React, { createContext, useReducer, useContext } from 'react';

const SET_AUTH = 'SET_AUTH';
const GlobalStateContext = createContext();

const initialState = {
    auth: {
        token: null
    }
}

const globalStateReducer = (state, action) => {
    switch(action.type){
        case SET_AUTH:
            return {
                ...state,
                auth: {...action.payload}
            };
        default:
            return state;
    }
}

export const GlobalStateProvider = ({children}) => {
    const [state, dispatch] = useReducer(globalStateReducer, initialState);
    return (
        <GlobalStateContext.Provider value={[state, dispatch]}>
            {children}
        </GlobalStateContext.Provider>
    )
}

const useGlobalState = () => {
    const [state, dispatch] = useContext(GlobalStateContext);

    const setAuth = ({token}) => {
        dispatch({
            type: SET_AUTH,
            payload: {
                token
            }
        });
    }
    
    return {
        auth: {...state.auth},
        setAuth
    }
}

export default useGlobalState;