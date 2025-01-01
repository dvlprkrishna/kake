"use client";
import React from "react";

const MarkSoldModalPresentation = ({
  customerName,
  customerPhone,
  handleCustomerNameChange,
  handleCustomerPhoneChange,
  handleSubmit,
  closeModal,
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter Customer Details</h2>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={handleCustomerNameChange}
        />
        <input
          type="text"
          placeholder="Customer Phone"
          value={customerPhone}
          onChange={handleCustomerPhoneChange}
        />
        <button onClick={handleSubmit}>Mark as Sold</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default MarkSoldModalPresentation;
