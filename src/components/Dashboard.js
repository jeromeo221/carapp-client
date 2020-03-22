import React, { useState, Fragment, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../containers/Spinner';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = (props) => {

    const [isVehicleLoading, setIsVehicleLoading] = useState(true);
    const [vehicleLoadError, setVehicleLoadError] = useState(null);
    const [vehicles, setVehicles] = useState(null);
    const {token} = useContext(AuthContext);

    useEffect(() => {
        const getVehicleList = async () => {
            try {
                setVehicleLoadError(null);
                const response = await axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + '/vehicles', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.success){
                    setVehicles(response.data.data);
                } else {
                    throw new Error(response.data.error);
                }                    
            } catch(err){
                setVehicleLoadError(err.message);
            } finally {
                setIsVehicleLoading(false);
            }
        }
        getVehicleList();
    }, [token])

    const displayGetVehicle = () => {
        if(!isVehicleLoading){
            if(!vehicleLoadError){
                return (
                    <Fragment>
                        <div className="row">
                            {displayVehicleList()}
                        </div>
                        {displayAddVehicle()}
                    </Fragment>
                )
            } else {
                return (
                    <h6>{vehicleLoadError}</h6>
                )
            }
        } else {
            return (<Spinner/>)
        }
    }

    const displayVehicleList = () => {
        return vehicles.map(vehicle => {
            return (
                <div key={vehicle._id} className="col-sm-12 col-md-6 col-lg-4 mt-2">
                    <div className="card" style={{minHeight: '180px'}}>
                        <div className="card-body">
                            <h4 className="card-title">{vehicle.year} {vehicle.model}</h4>
                            <h6 className="card-subtitle mb-2 text-muted">{vehicle.make}</h6>
                            <p className="card-text">{vehicle.name}</p>
                            <Link to={"/vehicles/" + vehicle._id} className="card-link">Details</Link>
                        </div>
                    </div>
                </div>
            )
        })
    }

    const displayAddVehicle = () => {
        return (
            <div className="row text-center mt-2">
                <div className="col-12">
                    <Link to="/vehicles/add">
                        <button type="button" className="btn btn-outline-secondary col-lg-12">Add Vehicle</button>
                    </Link>
                </div>                
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="container mt-4">
                <h1>Vehicles</h1>
                {displayGetVehicle()}
            </div>
        </React.Fragment>
    )
}

export default Dashboard;