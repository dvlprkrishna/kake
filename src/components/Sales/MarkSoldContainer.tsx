"use client";
import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { updateDoc, doc } from "firebase/firestore";
import MarkSoldModalPresentation from "@/components/Sales/MarkSoldModalPresentation"; // Import the presentation component

const MarkSoldContainer = ({ selectedCakes, closeModal }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleCustomerNameChange = (e) => setCustomerName(e.target.value);
  const handleCustomerPhoneChange = (e) => setCustomerPhone(e.target.value);

  const handleSubmit = async () => {
    if (!customerName || !customerPhone) {
      alert("Please fill in all the customer details.");
      return;
    }

    try {
      // Loop over selected cakes and update them
      for (const cakeId of selectedCakes) {
        const cakeRef = doc(db, "cakes", cakeId);
        await updateDoc(cakeRef, {
          status: "Sold",
          customer: {
            name: customerName,
            phone: customerPhone,
            sold_at: new Date(),
          },
        });
      }

      alert("Cakes marked as sold successfully!");
      closeModal(); // Close the modal after submission
    } catch (error) {
      console.error("Error marking cakes as sold: ", error);
    }
  };

  return (
    <MarkSoldModalPresentation
      customerName={customerName}
      customerPhone={customerPhone}
      handleCustomerNameChange={handleCustomerNameChange}
      handleCustomerPhoneChange={handleCustomerPhoneChange}
      handleSubmit={handleSubmit}
      closeModal={closeModal}
    />
  );
};

export default MarkSoldContainer;
