"use client";
import React from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate unique IDs

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
        sku: "kk-" + uuidv4().slice(0, 5), // Generates a unique SKU using UUID
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
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <h1>Test Firestore with Unique Mock Data</h1>
      <button
        onClick={testFirestore}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Unique Cake Data
      </button>
    </div>
  );
};

export default TestFirestore;
