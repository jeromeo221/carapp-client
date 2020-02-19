import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useGlobalState from '../hooks/useGlobalState';

const VehicleMaint = (props) => {
    
    const [id] = useState(props.match.params.id);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {token} = useGlobalState().auth;

    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [name, setName] = useState("");
    
    useEffect(() => {
        const getVehicleDetails = async () => {
            setError(null);
            setIsLoading(true);
            try {
                const response = await axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + `/vehicles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                if(response.data.success){
                    setMake(response.data.data.make);
                    setModel(response.data.data.model);
                    setYear(response.data.data.year);
                    setName(response.data.data.name);
                } else {
                    setError(response.data.error)
                }
            } catch(error){
                throw error;             
            } finally {
                setIsLoading(false);
            }
            
        }
        if(id) getVehicleDetails();
    }, [id, token]);

    const handleOk = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        const data = {
            make,
            model,
            year,
            name
        }
        if(id){
            //Update Vehicle
            try {
                const response = await axios.put(process.env.REACT_APP_BACKEND_ENDPOINT + `/vehicles/${id}`, {data}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                if(response.data.success){
                    props.history.push(`/vehicles/${id}`);
                } else {
                    throw new Error(response.data.error);
                }
            } catch(err){
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            //Add Vehicle
            try {
                const response = await axios.post(process.env.REACT_APP_BACKEND_ENDPOINT + `/vehicles/`, {data}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                if(response.data.success){
                    props.history.push(`/vehicles/${response.data.data._id}`);
                } else {
                    throw new Error(response.data.error);
                }
            } catch(err){
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        if(id) {
            props.history.push(`/vehicles/${id}`);
        } else {
            props.history.push(`/`);
        }
    }

    const displayForm = () => {
        return (
            <form onSubmit={handleOk}>
                <div className="form-group">
                    <label htmlFor="inputMake">Make</label>
                    <input type="text" className="form-control" id="inputMake" placeholder="Enter make" 
                        value={make || ''} 
                        onChange={e => setMake(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputModel">Model</label>
                    <input type="text" className="form-control" id="inputModel" placeholder="Enter model" 
                        value={model || ''} 
                        onChange={e => setModel(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputYear">Year</label>
                    <input type="text" className="form-control" id="inputYear" placeholder="Enter year" 
                        value={year || ''} 
                        onChange={e => setYear(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputName">Name</label>
                    <input type="text" className="form-control" id="inputName" placeholder="Enter name" 
                        value={name || ''} 
                        onChange={e => setName(e.target.value)}/>
                </div>
                <button className="btn btn-primary" type="submit">{id ? "Update" : "Add"}</button>
                <button className="btn btn-primary" onClick={handleCancel}>Cancel</button>
            </form>
        )
    }

    return (
        <div className="container mt-4">
            <div align="center">
                <h2>{id ? "Update" : "Add"} Vehicle</h2>
            </div>
            {error ?
            (<div className="alert alert-dismissible alert-danger">
                <button type="button" className="close" data-dismiss="alert">&times;</button>
                {error}
            </div>) : null}
            {!isLoading ?
            displayForm() : ( 
                <div>
                    <h3>Processing...</h3>
                    <button className="btn btn-primary" onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </div>
    )
}

export default VehicleMaint;