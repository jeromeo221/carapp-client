import React from 'react';

const Modal = (props) => {
    return (
        <div className="modal fade" id={props.modalId} tabIndex="-1" data-backdrop="static"  aria-labelledby={props.modalId+"Label"}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id={props.modalId+"Label"}>{props.title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.onCancel}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={props.onCancel}>Cancel</button>
                    <button type="button" className="btn btn-primary" data-dismiss="modal"  onClick={props.onConfirm}>{props.confirmText}</button>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;