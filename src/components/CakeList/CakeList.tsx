"use client";
import React, { useState } from "react";
import MarkSoldContainer from "@/components/Sales/MarkSoldContainer"; // Import container

type Cake = {
  id: string;
  name: string;
  price: string;
  weight: string;
  sku: string;
  status: string;
  type: string;
};

type CakeListProps = {
  cakes: Cake[];
  isLoading: boolean;
};

const CakeList = ({ cakes, isLoading }: CakeListProps) => {
  const [selectedCakes, setSelectedCakes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (isLoading) {
    return <p>Loading cakes...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-semibold">Cake List</h1>

      {/* Button for marking selected cakes as sold */}
      <button
        onClick={handleMarkAsSold}
        className="mb-4 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Mark Selected Cakes as Sold
      </button>

      {/* Cake List Table */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border-b px-4 py-2">Select</th>
              <th className="border-b px-4 py-2">Cake Name</th>
              <th className="border-b px-4 py-2">Price</th>
              <th className="border-b px-4 py-2">Weight</th>
              <th className="border-b px-4 py-2">sku</th>
              <th className="border-b px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {cakes.map((cake) => (
              <tr key={cake.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(e, cake.id)}
                    className="form-checkbox"
                    disabled={cake.status === "Sold"}
                  />
                </td>
                <td className="border-b px-4 py-2">{cake.name}</td>
                <td className="border-b px-4 py-2">₹{cake.price}</td>
                <td className="border-b px-4 py-2">{cake.weight} g</td>
                <td className="border-b px-4 py-2">{cake.sku}</td>
                <td className="border-b px-4 py-2">
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
