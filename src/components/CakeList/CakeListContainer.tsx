"use client";
// containers/CakeListContainer.tsx
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import CakeList from "./CakeList"; // Presentation component

const CakeListContainer = () => {
  const [cakes, setCakes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCakes = async () => {
      const querySnapshot = await getDocs(collection(db, "cakes"));
      const cakeData: any[] = [];
      querySnapshot.forEach((doc) => {
        cakeData.push({ id: doc.id, ...doc.data() });
      });
      setCakes(cakeData);
      setIsLoading(false);
    };

    fetchCakes();
  }, []);

  return <CakeList cakes={cakes} isLoading={isLoading} />;
};

export default CakeListContainer;
