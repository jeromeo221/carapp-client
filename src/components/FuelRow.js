import React from 'react';

const FuelRow = ({fuel, setToEditFuel, setDeleteFuelId}) => {

    return (  
        <tr className="table-primary">
            <td>
                {new Date(fuel.date).toLocaleString()}
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
            <td align="center">
                {fuel.isEstOdo && 'Y' }
            </td>
            <td>{fuel.mileage && parseFloat(fuel.mileage).toFixed(2)}</td>
            <td>{fuel.pricekm && parseFloat(fuel.pricekm).toFixed(2)}</td>
            <td>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => setToEditFuel(fuel)}>Edit</button>
                <button type="button" className="btn btn-danger btn-sm" data-toggle="modal" data-target="#fuelDeleteModal" onClick={() => setDeleteFuelId(fuel._id)}>Delete</button>
            </td>
        </tr>
    );
}
 
export default FuelRow;