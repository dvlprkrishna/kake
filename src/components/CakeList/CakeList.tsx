"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import MarkSoldContainer from "@/components/Sales/MarkSoldContainer"; // Import container

interface Cake {
  id: string;
  name: string;
  price: number;
  weight: number;
  status: string;
}
const CakeList = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [selectedCakes, setSelectedCakes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCakes = async () => {
      const querySnapshot = await getDocs(collection(db, "cakes"));
      const cakesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Cake[];
      setCakes(cakesData);
    };

    fetchCakes();
  }, []);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    cakeId: string
  ) => {
    if (e.target.checked) {
      setSelectedCakes((prevSelected) => [...prevSelected, cakeId]);
    } else {
      setSelectedCakes((prevSelected) =>
        prevSelected.filter((id) => id !== cakeId)
      );
    }
  };

  const handleMarkAsSold = () => {
    if (selectedCakes.length === 0) {
      alert("Please select at least one cake.");
      return;
    }
    setIsModalOpen(true); // Open the modal to get customer data
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Cake List</h1>

      {/* Button for marking selected cakes as sold */}
      <button
        onClick={handleMarkAsSold}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
      >
        Mark Selected Cakes as Sold
      </button>

      {/* Cake List Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">Select</th>
              <th className="px-4 py-2 border-b">Cake Name</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">Weight</th>
              <th className="px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {cakes.map((cake) => (
              <tr key={cake.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(e, cake.id)}
                    className="form-checkbox"
                  />
                </td>
                <td className="px-4 py-2 border-b">{cake.name}</td>
                <td className="px-4 py-2 border-b">₹{cake.price}</td>
                <td className="px-4 py-2 border-b">{cake.weight} g</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium ${
                      cake.status === "Sold"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {cake.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Mark Sold */}
      {isModalOpen && (
        <MarkSoldContainer
          selectedCakes={selectedCakes}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CakeList;
