import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import LoaderButton from '../containers/LoaderButton';

const FuelRowEdit = ({toEditFuel, setToEditFuel, setTransUpdate}) => {

    const [isLoadingEditFuel, setIsLoadingEditFuel] = useState(false);
    const [editFuelErrors, setEditFuelErrors] = useState(null);
    const {token} = useContext(AuthContext);

    const odometerField = useRef(null);
    const volumeField = useRef(null);
    const priceField = useRef(null);
    const costField = useRef(null);
    const isFullField = useRef(null);
    const isMissedField = useRef(null);
    const isEstOdoField = useRef(null);
    
    useEffect(() => {
        if(toEditFuel){
            setEditFuelErrors(null);
            odometerField.current.value = toEditFuel.odometer;
            volumeField.current.value = toEditFuel.volume;
            priceField.current.value = toEditFuel.price;
            costField.current.value = toEditFuel.cost;
            isFullField.current.checked = toEditFuel.isFull;
            isMissedField.current.checked = toEditFuel.isMissed;
            isEstOdoField.current.checked = toEditFuel.isEstOdo;
        }        
    }, [toEditFuel])

    const saveEditFuel = async () => {
        setIsLoadingEditFuel(true);
        let saveOk = false;

        try {
            if(!odometerField.current.value) throw new Error('Odometer is required');
            if(!volumeField.current.value) throw new Error('Volume is required');
            if(!priceField.current.value) throw new Error('Price is required');
            if(!costField.current.value) throw new Error('Cost is required');

            const result = await axios.put(process.env.REACT_APP_BACKEND_ENDPOINT + `/fuels/${toEditFuel._id}`, {
                vehicle: toEditFuel.vehicleId,
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
                saveOk = true;
                
            } else {
                setEditFuelErrors(result.data.error);
            }
        } catch(err){
            setEditFuelErrors(err.message);
        } finally {
            setIsLoadingEditFuel(false);
        }

        if(saveOk){
            setTransUpdate(true);
            setToEditFuel(null);
        }
    }

    return (  
        <>
            {editFuelErrors ?
            (<tr>
                <td colSpan="11">
                    <div className="alert alert-dismissible alert-danger">
                        <button type="button" className="close" onClick={() => setEditFuelErrors(null)}>&times;</button>
                        {editFuelErrors}
                    </div>
                </td>    
            </tr>) : null}                        
            <tr className="table-primary">
                <td>
                    {new Date(toEditFuel.date).toLocaleString()}
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
                <td align="center">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input input-table-row" id="isEstOdoEditCheck" ref={isEstOdoField}/>
                        <label className="custom-control-label" htmlFor="isEstOdoEditCheck"/>
                    </div>            
                </td>
                <td>{toEditFuel.mileage && parseFloat(toEditFuel.mileage).toFixed(2)}</td>
                <td>{toEditFuel.pricekm && parseFloat(toEditFuel.pricekm).toFixed(2)}</td>
                <td>
                    <LoaderButton isLoading={isLoadingEditFuel} onClick={saveEditFuel} className="btn-primary btn-sm">Save</LoaderButton>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setToEditFuel(null)}>Cancel</button>
                </td>
            </tr>
        </>
    );
}
 
export default FuelRowEdit;