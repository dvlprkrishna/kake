"use client";
import React from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate unique IDs
import { toast } from "sonner";
import { Button } from "./ui/button";

// Helper function to generate random cake name
const generateRandomCakeName = () => {
  const cakeNames = [
    "Chocolate Cake",
    "Vanilla Cake",
    "Strawberry Cake",
    "Red Velvet Cake",
    "Fruit Cake",
  ];
  return cakeNames[Math.floor(Math.random() * cakeNames.length)];
};

// Helper function to generate random price (between 100 to 1000)
const generateRandomPrice = () => {
  return Math.floor(Math.random() * 120) * 50 + 49;
};

// Helper function to generate random weight (between 500g to 2000g)
const generateRandomWeight = () => {
  return Math.floor(Math.random() * 200 + 1) * 50;
};

// Helper function to generate random expiry date (within the next 30 days)
const generateRandomExpiryDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + Math.floor(Math.random() * 30)); // Random expiry within 30 days
  return today;
};

// Helper function to generate random image URL (mock image path)
const generateRandomImageURL = () => {
  return `/images/cakes/${uuidv4()}.jpg`; // Generates a unique image path using UUID
};

const TestFirestore = () => {
  const testFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "cakes"), {
        sku: "K-" + uuidv4().slice(0, 4).toUpperCase(), // Generates a unique SKU using UUID
        name: generateRandomCakeName(),
        type: "Dessert", // You can add a list of types and randomize them
        price: generateRandomPrice(),
        weight: generateRandomWeight(),
        image: generateRandomImageURL(),
        description: "A delicious random cake", // Mock description, you can randomize this as well
        status: "Available", // You can randomize between 'Sold' and 'Available' if required
        created_at: new Date(),
        updated_at: new Date(),
        expiry_at: generateRandomExpiryDate(),
      });
      toast.success(`Dummy Cake added with ID: ${docRef.id}`);

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-semibold">Insert Dummy Cake Data</h2>
      <Button onClick={testFirestore} className="rounded px-4 py-2">
        Add Dummy Cake Data
      </Button>
    </div>
  );
};

export default TestFirestore;
