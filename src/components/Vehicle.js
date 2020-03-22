import React, { useState, useEffect, Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Fuel from './Fuel';
import Modal from '../containers/Modal';
import Spinner from '../containers/Spinner';
import { AuthContext } from '../contexts/AuthContext';

const Vehicle = (props) => {
    
    const [id] = useState(props.match.params.id);
    const [detail, setDetail] = useState(null);
    const [errors, setErrors] = useState(null);
    const [isVehicleLoading, setIsVehicleLoading] = useState(true);
    const [vehicleLoadError, setVehicleLoadError] = useState(null);
    const {token} = useContext(AuthContext);

    useEffect(() => {
        const getVehicleDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_ENDPOINT}/vehicles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.success){
                    setVehicleLoadError(null);
                    setDetail(response.data.data);
                } else {
                    setVehicleLoadError(response.data.error);                    
                    setDetail(null);                
                }        
            } catch(err){
                setVehicleLoadError(err.message);
            } finally {
                setIsVehicleLoading(false);
            }
        }
        getVehicleDetails();
    }, [id, token]);    

    const displayDetail = () => {
        if(detail && !vehicleLoadError){
            return (
                <Fragment>
                    <div className="row">
                        <h1>{detail.year} {detail.make} {detail.model}</h1>
                    </div>
                    <div className="row">
                        <h4>{detail.name}</h4>
                    </div>
                    <div className="row mt-2">
                        <Link to={"/vehicles/" + id + "/update"}>
                            <button className="btn btn-primary btn-sm">Edit</button>
                        </Link>
                        <button className="btn btn-danger btn-sm" data-toggle="modal" data-target="#vehicleDeleteModal">Delete</button>
                    </div>
                </Fragment>
            )            
        } else {
            if(isVehicleLoading){
                return (
                    <div><Spinner/></div>
                )
            } else if(vehicleLoadError) {
                return (
                    <h3>{vehicleLoadError}</h3>
                )
            } else {
                return (
                    <h3>Unable to find vehicle</h3>
                )
            }           
        }
    }

    const deleteVehicle = async (id) => {
        try {
            const result = await axios.delete(process.env.REACT_APP_BACKEND_ENDPOINT + `/vehicles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(result.data.success){
                props.history.push(`/`);
            } else {
                setErrors(result.data.error);
            }
        } catch(err){
            setErrors(err);
        }
    }

    const cancelDeleteVehicle = () => {
        //Do nothing
    }

    return (
        <Fragment>
            <Modal title="Confirm Delete Vehicle" 
                    modalId="vehicleDeleteModal"
                    onConfirm={() => deleteVehicle(id)} 
                    onCancel={cancelDeleteVehicle}
                    confirmText="Delete">
                    <p>Are you sure you want to delete this vehicle? This action cannot be undone.</p>
                    <p>Note that all fuel transactions have to be deleted first manually for now.</p>
            </Modal>
            <div className="container mt-4">
                {errors ? (<div className="alert alert-dismissible alert-danger">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    {errors}
                </div>) : null}
                {displayDetail()}
                {detail && <Fuel vehicleId={id} />}
            </div>
        </Fragment>   
    )
}

export default Vehicle;