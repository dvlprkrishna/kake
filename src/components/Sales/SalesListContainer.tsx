"use client";
// containers/SalesListContainer.tsx
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import SalesList from "./SalesList"; // Presentation component

interface Cake {
  id: string;
  name: string;
  price: string;
  weight: string;
  sku: string;
  status: string;
  type: string;
  expiry_at: string | Timestamp;
  customer?: {
    sold_at?: Timestamp | string; // Sold date and time
    name: string;
    phone: string;
  }; // Nested customer object
}

const SalesListContainer = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCakes = async () => {
      const querySnapshot = await getDocs(collection(db, "cakes"));
      const cakeData: Cake[] = [];
      querySnapshot.forEach((doc) => {
        cakeData.push({ id: doc.id, ...doc.data() } as Cake);
      });
      setCakes(cakeData);
      setIsLoading(false);
    };

    fetchCakes();
  }, []);

  return <SalesList cakes={cakes} isLoading={isLoading} />;
};

export default SalesListContainer;
