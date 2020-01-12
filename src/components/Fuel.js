import React, { useState, useEffect, useRef, Fragment } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import '../tableinput.css';

const Fuel = (props) => {
    
    const [vehicleId] = useState(props.vehicleId);
    const [fuels, setFuels] = useState(null);
    const [isAddFuel, setIsAddFuel] = useState(0);
    const [errors, setErrors] = useState(null);
    const [addFuelErrors, setAddFuelErrors] = useState(null);
    const [editFuelErrors, setEditFuelErrors] = useState(null);
    const [transUpdate, setTransUpdate] = useState(true);
    const [deleteFuelId, setDeleteFuelId] = useState(null);
    const [toEditFuel, setToEditFuel] = useState(null);
    const [isLoadingFuel, setIsLoadingFuel] = useState(true);

    //Fuel Fields
    const dateField = useRef(null);
    const odometerField = useRef(null);
    const volumeField = useRef(null);
    const priceField = useRef(null);
    const costField = useRef(null);
    const isFullField = useRef(null);
    const isMissedField = useRef(null);

    useEffect(() => {
        const getFuel = async () => {
            const response = await axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + `/fuels`, {
                params: {
                    vehicleId: vehicleId
                }
            });
            setFuels(response.data.data);
            setIsLoadingFuel(false);
        }
        if(transUpdate){
            getFuel();    
        }
        setTransUpdate(false);  
    }, [vehicleId, transUpdate]);

    const confirmedDeleteFuel = async () => {
        try {
            const result = await axios.delete(process.env.REACT_APP_BACKEND_ENDPOINT + `/fuels/${deleteFuelId}`);
            if(result.data.success){
                setTransUpdate(true);
            } else {
                setErrors(result.data.error);
            }
        } catch(err){
            setErrors(err);
        } finally {
            setDeleteFuelId(null);
        }
    }

    useEffect(() => {
        if(toEditFuel){
            setIsAddFuel(false);
            setEditFuelErrors(null);
            //Edit some row
            odometerField.current.value = toEditFuel.odometer;
            volumeField.current.value = toEditFuel.volume;
            priceField.current.value = toEditFuel.price;
            costField.current.value = toEditFuel.cost;
            isFullField.current.checked = toEditFuel.isFull;
            isMissedField.current.checked = toEditFuel.isMissed;
        }        
    }, [toEditFuel])

    useEffect(() => {
        if(isAddFuel){
            setToEditFuel(null);
        }
    }, [isAddFuel])

    const saveEditFuel = async () => {
        try {
            const result = await axios.put(process.env.REACT_APP_BACKEND_ENDPOINT + `/fuels/${toEditFuel._id}`, {
                vehicle: vehicleId,
                odometer: odometerField.current.value,
                volume: volumeField.current.value,
                price: priceField.current.value,
                cost: costField.current.value,
                isFull: isFullField.current.checked,
                isMissed: isMissedField.current.checked
            });
            if(result.data.success){
                setToEditFuel(null);
                setTransUpdate(true);
            } else {
                setEditFuelErrors(result.data.error);
            }
        } catch(err){
            setEditFuelErrors(err.message);
        }
    }

    const displayFuelList = () => {
        if(fuels){
            return fuels.map((fuel) => {
                return (
                    <Fragment key={fuel._id}>
                        {(toEditFuel && fuel._id === toEditFuel._id) ? (
                        <Fragment>
                            {editFuelErrors ?
                            (<tr>
                                <td colSpan="10">
                                    <div className="alert alert-dismissible alert-danger">
                                        <button type="button" className="close" data-dismiss="alert" onClick={() => setEditFuelErrors(null)}>&times;</button>
                                        {editFuelErrors}
                                    </div>
                                </td>    
                            </tr>) : null}                        
                            <tr className="table-primary">
                                <td>
                                    {new Date(fuel.date).toLocaleDateString()}
                                </td>
                                <td>
                                    <div><input type="text" className="input-table-row" ref={odometerField}/></div>
                                </td>
                                <td>
                                    <div><input type="text" className="input-table-row" ref={volumeField}/></div>
                                </td>
                                <td>
                                    <div><input type="text" className="input-table-row" ref={priceField}/></div>
                                </td>
                                <td>
                                    <div><input type="text" className="input-table-row" ref={costField}/></div>
                                </td>
                                <td align="center">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input input-table-row" id="isFullEditCheck" ref={isFullField}/>
                                        <label className="custom-control-label" htmlFor="isFullEditCheck"/>
                                    </div>                                    
                                </td>
                                <td align="center">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input input-table-row" id="isMissedEditCheck" ref={isMissedField}/>
                                        <label className="custom-control-label" htmlFor="isMissedEditCheck"/>
                                    </div> 
                                </td>
                                <td>{fuel.mileage && parseFloat(fuel.mileage).toFixed(2)}</td>
                                <td>{fuel.pricekm && parseFloat(fuel.pricekm).toFixed(2)}</td>
                                <td>
                                    <button type="button" className="btn btn-primary btn-sm" onClick={saveEditFuel}>Save</button>
                                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setToEditFuel(null)}>Cancel</button>
                                </td>
                            </tr>
                        </Fragment>
                        ) : (
                        <tr className="table-primary">
                            <td>
                                {new Date(fuel.date).toLocaleDateString()}
                            </td>
                            <td>
                                {fuel.odometer}
                            </td>
                            <td>
                                {parseFloat(fuel.volume).toFixed(2)}
                            </td>
                            <td>
                                {parseFloat(fuel.price).toFixed(2)}
                            </td>
                            <td>
                                ${parseFloat(fuel.cost).toFixed(2)}
                            </td>
                            <td align="center">
                                {fuel.isFull && 'Y' }
                            </td>
                            <td align="center">
                                {fuel.isMissed && 'Y' }
                            </td>
                            <td>{fuel.mileage && parseFloat(fuel.mileage).toFixed(2)}</td>
                            <td>{fuel.pricekm && parseFloat(fuel.pricekm).toFixed(2)}</td>
                            <td>
                                <button type="button" className="btn btn-primary btn-sm" onClick={() => setToEditFuel(fuel)}>Edit</button>
                                <button type="button" className="btn btn-danger btn-sm" data-toggle="modal" data-target="#fuelDeleteModal" onClick={() => setDeleteFuelId(fuel._id)}>Delete</button>
                            </td>
                        </tr>
                        )}                            
                    </Fragment>
                )
            });
        } 
    }

    const addFuel = async (e) => {
        e.preventDefault();
        setAddFuelErrors(null);
        try {
            const result = await axios.post(process.env.REACT_APP_BACKEND_ENDPOINT + `/fuels`, {
                vehicle: vehicleId,
                date: dateField.current.value,
                odometer: odometerField.current.value,
                volume: volumeField.current.value,
                price: priceField.current.value,
                cost: costField.current.value,
                isFull: isFullField.current.checked,
                isMissed: isMissedField.current.checked
            });
            if(result.data.success){
                setIsAddFuel(false);
                setTransUpdate(true);
            } else {
                setAddFuelErrors(result.data.error);
            }
        } catch(err){
            setAddFuelErrors(err.message);
        }
    }

    const displayAddFuel = () => {
        return (
            <tr>
                <td colSpan="10">
                    <b>Add Fuel</b>
                    <div className="form-group" style={{width: '50%'}}>
                        <label className="col-form-label" htmlFor="inputDate">Date</label>
                        <input type="date" className="form-control form-control-sm" ref={dateField} id="inputDate" />
                        <label className="col-form-label" htmlFor="inputOdometer">Odometer</label>
                        <input type="number" className="form-control form-control-sm" ref={odometerField} id="inputOdometer" />
                        <label className="col-form-label" htmlFor="inputVolume">Volume</label>
                        <input type="text" className="form-control form-control-sm" ref={volumeField} id="inputVolume" />
                        <label className="col-form-label" htmlFor="inputPrice">Price</label>
                        <input type="text" className="form-control form-control-sm" ref={priceField} id="inputPrice" />
                        <label className="col-form-label" htmlFor="inputCost">Cost</label>
                        <input type="text" className="form-control form-control-sm" ref={costField} id="inputCost" />
                    </div>
                    <div className="form-group">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" ref={isFullField} id="isFullCheck"/>
                            <label className="custom-control-label" htmlFor="isFullCheck">Full Tank</label>
                        </div>
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" ref={isMissedField} id="isMissedFillCheck"/>
                            <label className="custom-control-label" htmlFor="isMissedFillCheck">Missed Fillup</label>
                        </div>
                    </div>
                    {addFuelErrors ?
                    (<div className="alert alert-dismissible alert-danger">
                        <button type="button" className="close" data-dismiss="alert">&times;</button>
                        {addFuelErrors}
                    </div>) : null}
                    <button type="submit" className="btn btn-primary btn-sm" onClick={addFuel}>Add</button>
                    <button type="submit" className="btn btn-danger btn-sm" onClick={() => setIsAddFuel(false)}>Cancel</button>
                </td>
            </tr>
        )
    }

    const handleDisplayFuelAdd = (e) => {
        e.preventDefault();
        setIsAddFuel(true);
        setAddFuelErrors(null);
    }
    
    return (
        <Fragment>
            <Modal title="Confirm Delete Fuel" 
                modalId="fuelDeleteModal"
                onConfirm={confirmedDeleteFuel} 
                onCancel={() => setDeleteFuelId(null)}
                confirmText="Delete">
                <p>Are you sure you want to delete this fuel transaction? This action cannot be undone.</p>
            </Modal>
            <div className="mt-4 row">
                <h3>Fuel Transactions</h3>
            </div>
            <div className="mt-2 row">
                {errors ?
                (<div className="alert alert-dismissible alert-danger">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    {errors}
                </div>) : null}
                {!isLoadingFuel ? 
                (<table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Odometer</th>
                            <th>Volume</th>
                            <th>Price</th>
                            <th>Cost</th>
                            <th>Full Tank?</th>
                            <th>Missed Fillup?</th>
                            <th>Mileage</th>
                            <th>Price per Km</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayFuelList()}
                        {isAddFuel ? (displayAddFuel()) : null}
                        {!isAddFuel ? (<tr className="table-primary">
                            <td align="left" colSpan="10">
                                <button type="button" className="btn btn-primary btn-sm" onClick={handleDisplayFuelAdd}>+</button>
                            </td>
                        </tr>) : null}
                    </tbody>
                </table>) :
                (
                    <div><Spinner/></div>
                )}
            </div>
        </Fragment>
    )
}

export default Fuel;