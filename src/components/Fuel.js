import React, { useState, useEffect, Fragment, useContext } from 'react';
import axios from 'axios';
import Modal from '../containers/Modal';
import Spinner from '../containers/Spinner';
import '../tableinput.css';
import { AuthContext } from '../contexts/AuthContext';
import FuelAdd from './FuelAdd';
import FuelRow from './FuelRow';
import FuelRowEdit from './FuelRowEdit';

const Fuel = (props) => {
    
    const [vehicleId] = useState(props.vehicleId);
    const [fuels, setFuels] = useState(null);
    const [errors, setErrors] = useState(null);
    const [transUpdate, setTransUpdate] = useState(true);
    const [deleteFuelId, setDeleteFuelId] = useState(null);
    const [toEditFuel, setToEditFuel] = useState(null);
    const [isLoadingFuel, setIsLoadingFuel] = useState(true);
    const {token} = useContext(AuthContext);
        
    //Pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(null);

    useEffect(() => {
        const getFuel = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + `/fuels`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        vehicleId,
                        page,
                        limit
                    }
                });
                if(response.data.success){
                    setFuels(response.data.data);
                    setTotalPages(response.data.options.totalPages);
                } else {
                    throw new Error(response.data.error);
                }                
            } catch(err){
                setErrors(err.message);
            } finally {
                setIsLoadingFuel(false);
            }
        }
        if(transUpdate){
            getFuel();    
            setTransUpdate(false);  
        }        
    }, [vehicleId, transUpdate, limit, page, token]);

    const confirmedDeleteFuel = async () => {
        try {
            const result = await axios.delete(process.env.REACT_APP_BACKEND_ENDPOINT + `/fuels/${deleteFuelId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(result.data.success){
                setTransUpdate(true);
            } else {
                throw new Error(result.data.error);
            }
        } catch(err){
            setErrors(err.message);
        } finally {
            setDeleteFuelId(null);
        }
    }

    const displayFuelList = () => {
        if(fuels){
            return fuels.map((fuel) => {
                return (
                    <Fragment key={fuel._id}>
                        {(toEditFuel && fuel._id === toEditFuel._id) ? (
                            <FuelRowEdit 
                                toEditFuel={toEditFuel} 
                                setToEditFuel={setToEditFuel} 
                                setTransUpdate={setTransUpdate}
                            />
                        ) : (
                            <FuelRow 
                                fuel={fuel}
                                setToEditFuel={setToEditFuel}
                                setDeleteFuelId={setDeleteFuelId}
                            />
                        )}                            
                    </Fragment>
                )
            });
        } 
    }

    const displayPagination = () => {
        if(totalPages && totalPages > 1 && !isLoadingFuel){
            let downButton = "";
            let upButton = "";
            if(page === 1) downButton = " disabled";
            if(page === totalPages) upButton = " disabled";

            return (
                <ul className="pagination pagination-sm" align="right">
                    <li key="page-0" className={"page-item" + downButton}>
                        <button className="page-link" onClick={() => handlePaginateButton(page-1)}>&laquo;</button>
                    </li>
                    {displayPaginationPages()}
                    <li key={"page-"+ totalPages+1} className={"page-item" + upButton}>
                        <button className="page-link" onClick={() => handlePaginateButton(page+1)}>&raquo;</button>
                    </li>
                </ul>
            )
        } else {
            return (
                null
            )
        }
    }

    const displayPaginationPages = () => {
        let pageNumbers = [];
        for(let i = 1; i <= totalPages; i++){
            let buttonActive = "";
            if(i === page) buttonActive = " active";
            const pageObj = {
                i,
                buttonActive
            }
            pageNumbers.push(pageObj);
        }
        return pageNumbers.map(pageObj => {
            return (
                <li key={"page" + pageObj.i} className={"page-item" + pageObj.buttonActive}>
                    <button className="page-link"  onClick={() => handlePaginateButton(pageObj.i)}>{pageObj.i}</button>
                </li>
            )
        });
    }

    const handlePaginateButton = (newPage) => {
        setPage(newPage);
        setTransUpdate(true);
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
                <div className="mr-auto">
                    <h3>Fuel Transactions</h3>
                </div>                
                <div>
                    {displayPagination()}
                </div>                
            </div>
            <div className="mt-2 row">
                {errors ?
                (<div className="alert alert-dismissible alert-danger">
                    <button type="button" className="close" onClick={() => setErrors(null)}>&times;</button>
                    {errors}
                </div>) : null}
                {!isLoadingFuel ? 
                (<Fragment>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Odometer</th>
                                <th>Volume</th>
                                <th>Price</th>
                                <th>Cost</th>
                                <th>Full</th>
                                <th>Missed</th>
                                <th>Est</th>
                                <th>Mileage</th>
                                <th>Price Km</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayFuelList()}
                            <FuelAdd vehicleId={vehicleId} setTransUpdate={setTransUpdate}/>
                        </tbody>
                    </table>
                </Fragment>) :
                (
                    <div><Spinner/></div>
                )}
            </div>
            <div className="mt-2 row">
                <div className="mr-auto"/>
                <div>
                    {displayPagination()}
                </div>
            </div>
        </Fragment>
    )
}

export default Fuel;