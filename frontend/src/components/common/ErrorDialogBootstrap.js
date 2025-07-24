import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorDialogBootstrap = ({ show, message, onClose }) => {
    return (
        <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={false}>
            <Modal.Body className="text-center">
                <div className="text-danger display-4 mb-3">❌</div>
                <h4 className="mb-2">Đăng nhập không thành công</h4>
                <p className="text-muted">{message}</p>
                <Button variant="primary" onClick={onClose}>OK</Button>
            </Modal.Body>
        </Modal>
    );
};

export default ErrorDialogBootstrap;
