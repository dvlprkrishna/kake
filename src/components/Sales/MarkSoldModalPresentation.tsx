"use client";
import React from "react";

// Define prop types
interface MarkSoldModalPresentationProps {
  customerName: string;
  customerPhone: string;
  handleCustomerNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomerPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  closeModal: () => void;
}

const MarkSoldModalPresentation: React.FC<MarkSoldModalPresentationProps> = ({
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
