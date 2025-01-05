"use client";
import React, { useState } from "react";
import MarkSoldContainer from "@/components/Sales/MarkSoldContainer"; // Import container
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import shadcn dialog components
import { toast } from "sonner"; // Import Sonner
import { Button } from "../ui/button";

// Cake Type
type Cake = {
  id: string;
  name: string;
  price: string;
  weight: string;
  sku: string;
  status: string;
  type: string;
};

// CakeList Props
type CakeListProps = {
  cakes: Cake[];
  isLoading: boolean;
};

const CakeList = ({ cakes, isLoading }: CakeListProps) => {
  const [selectedCakes, setSelectedCakes] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

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
      toast.error("Please select at least one cake.");
      return;
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    if (shouldRefresh) {
      window.location.reload();
    }
  };

  if (isLoading) {
    return <p>Loading cakes...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-semibold">Cake List</h1>

      {/* Button for marking selected cakes as sold */}
      <Button onClick={handleMarkAsSold} className="mb-4 px-6 py-2">
        Mark as Sold
      </Button>

      {/* Cake List Table */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border-b px-4 py-2">Select</th>
              <th className="border-b px-4 py-2">Id</th>
              <th className="border-b px-4 py-2">Cake Name</th>
              <th className="border-b px-4 py-2">Price</th>
              <th className="border-b px-4 py-2">Weight</th>
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
                <td className="border-b px-4 py-2">{cake.sku}</td>
                <td className="border-b px-4 py-2">{cake.name}</td>
                <td className="border-b px-4 py-2">₹{cake.price}</td>
                <td className="border-b px-4 py-2">{cake.weight} g</td>

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

      {/* Dialog for Mark Sold */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Cakes as Sold</DialogTitle>
            <DialogDescription>
              Enter customer details to mark the selected cakes as sold.
            </DialogDescription>
          </DialogHeader>
          <MarkSoldContainer
            selectedCakes={selectedCakes}
            onSoldSuccess={() => {
              setShouldRefresh(true); // Trigger refresh on success
              setIsDialogOpen(false); // Close dialog
            }}
            closeModal={() => setIsDialogOpen(false)} // Close dialog without refreshing
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CakeList;
