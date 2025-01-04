"use client";
import React from "react";
import { Button } from "../ui/button";

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
        <h2 className="text-sm font-semibold leading-none tracking-tight text-gray-800">
          Enter Customer Details
        </h2>
        <div className="mb-6 flex items-center gap-4">
          <label className="block w-full text-sm font-medium text-gray-700">
            Customer Name
          </label>
          <input
            type="text"
            placeholder="Ex. Krishna Sahu"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            value={customerName}
            onChange={handleCustomerNameChange}
          />
        </div>
        <div className="mb-6 flex items-center gap-4">
          <label className="block w-full text-sm font-medium text-gray-700">
            Contact Number
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            placeholder="+91 9820839348"
            value={customerPhone}
            onChange={handleCustomerPhoneChange}
          />
        </div>
        <div className="flex justify-center gap-x-4">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Mark as Sold</Button>
        </div>
      </div>
    </div>
  );
};

export default MarkSoldModalPresentation;
