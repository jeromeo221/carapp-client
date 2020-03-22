import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import LoaderButton from '../containers/LoaderButton';

const FuelAdd = ({vehicleId, setTransUpdate}) => {

    const [isLoadingAddFuel, setIsLoadingAddFuel] = useState(false);
    const [isAddFuel, setIsAddFuel] = useState(false);
    const [addFuelErrors, setAddFuelErrors] = useState(false);
    const {token} = useContext(AuthContext);

    const dateField = useRef(null);
    const timeField = useRef(null);
    const odometerField = useRef(null);
    const volumeField = useRef(null);
    const priceField = useRef(null);
    const costField = useRef(null);
    const isFullField = useRef(null);
    const isMissedField = useRef(null);
    const isEstOdoField = useRef(null);

    const addFuel = async (e) => {
        setIsLoadingAddFuel(true);
        e.preventDefault();
        setAddFuelErrors(null);
        try {
            //Combine Date and time field
            let timeValue = timeField.current.value;
            if(!timeValue) timeValue = '12:00'
            const dateTime = new Date(dateField.current.value + ' ' + timeValue);

            const result = await axios.post(process.env.REACT_APP_BACKEND_ENDPOINT + `/fuels`, {
                vehicle: vehicleId,
                date: dateTime,
                odometer: odometerField.current.value,
                volume: volumeField.current.value,
                price: priceField.current.value,
                cost: costField.current.value,
                isFull: isFullField.current.checked,
                isMissed: isMissedField.current.checked,
                isEstOdo: isEstOdoField.current.checked
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(result.data.success){
                setTransUpdate(true);
                setIsAddFuel(false);
            } else {
                setAddFuelErrors(result.data.error);
            }
        } catch(err){
            setAddFuelErrors(err.message);
            
        } finally {
            setIsLoadingAddFuel(false);
        }
    }
    
    const handleDisplayFuelAdd = (e) => {
        e.preventDefault();
        setIsAddFuel(true);
    }

    return (
        <>
            {isAddFuel ? (
            <tr className="table-primary">
                <td colSpan="11">
                    <form onSubmit={addFuel}>
                        <b>Add Fuel</b>
                        <div className="form-group" style={{width: '50%'}}>
                            <label className="col-form-label" htmlFor="inputDate">Date</label>
                            <input type="date" className="form-control form-control-sm" ref={dateField} id="inputDate" />
                            <label className="col-form-label" htmlFor="inputTime">Time</label>
                            <input type="time" className="form-control form-control-sm" ref={timeField} id="inputTime" />
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
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" ref={isEstOdoField} id="isEstOdoCheck"/>
                                <label className="custom-control-label" htmlFor="isEstOdoCheck">Odometer Estimated</label>
                            </div>
                        </div>
                        {addFuelErrors ?
                        (<div className="alert alert-dismissible alert-danger">
                            <button type="button" className="close" onClick={() => setAddFuelErrors(null)}>&times;</button>
                            {addFuelErrors}
                        </div>) : null}
                        <LoaderButton isLoading={isLoadingAddFuel} className="btn-primary btn-sm" type="submit">Add</LoaderButton>
                        <button type="submit" className="btn btn-danger btn-sm" onClick={() => setIsAddFuel(false)}>Cancel</button>
                    </form>
                </td>
            </tr>) : null}
            {!isAddFuel ? (
            <tr className="table-primary">
                <td align="left" colSpan="11">
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleDisplayFuelAdd}>+</button>
                </td>
            </tr>) : null}
        </>
    )
}
 
export default FuelAdd;