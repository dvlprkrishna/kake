"use client";
import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { updateDoc, doc } from "firebase/firestore";
import MarkSoldModalPresentation from "@/components/Sales/MarkSoldModalPresentation"; // Import the presentation component
import { toast } from "sonner"; // Import Sonner

// Define the prop types
interface MarkSoldContainerProps {
  selectedCakes: string[]; // Array of cake IDs
  closeModal: () => void; // Function to close the modal
  onSoldSuccess: () => void;
}

const MarkSoldContainer: React.FC<MarkSoldContainerProps> = ({
  selectedCakes,
  onSoldSuccess,
  closeModal,
}) => {
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomerName(e.target.value);
  const handleCustomerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomerPhone(e.target.value);

  const handleSubmit = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Please fill in all the customer details.");
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

      toast.success("Cakes marked as sold successfully!");
      onSoldSuccess();
      closeModal(); // Close the modal after submission
    } catch (error) {
      toast.error(`Error marking cakes as sold: ${error}`);
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
