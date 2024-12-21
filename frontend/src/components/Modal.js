import React from 'react';

const Modal = ({ message, onClose }) => {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  textAlign: 'center',
};

export default Modal;
