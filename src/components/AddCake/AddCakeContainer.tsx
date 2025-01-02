"use client";
// components/AddCake/AddCakeContainer.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Import your firestore configuration

type CakeFormData = {
  name: string;
  price: number;
  weight: number;
  type: string;
  sku: string;
  createdDate: string;
  expiryDate: string;
  imageUrl: string;
};

const AddCakeContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CakeFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (data: CakeFormData) => {
    setIsLoading(true);
    setErrorMessage("");

    // Check if SKU is unique
    const cakesCollection = collection(db, "cakes");
    const q = query(cakesCollection, where("sku", "==", data.sku));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setErrorMessage("SKU must be unique!");
      setIsLoading(false);
      return;
    }

    // Add new cake to Firestore
    try {
      await addDoc(cakesCollection, {
        ...data,
        createdDate: new Date(data.createdDate),
        expiryDate: new Date(data.expiryDate),
      });
      reset(); // Reset form after successful submission
      alert("Cake added successfully!");
    } catch (error) {
      setErrorMessage("Error adding cake. Please try again. " + error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-full w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add New Cake</h2>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cake Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Cake name is required" })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Price must be greater than 0" },
            })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <input
            type="number"
            {...register("weight", {
              required: "Weight is required",
              min: { value: 0.1, message: "Weight must be greater than 0" },
            })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.weight && (
            <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            {...register("type", { required: "Cake type is required" })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Vegetarian">Vegetarian</option>
            <option value="Eggless">Eggless</option>
            <option value="Egg">Egg</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            {...register("sku", { required: "SKU is required" })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.sku && (
            <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Created Date
          </label>
          <input
            type="date"
            {...register("createdDate", {
              required: "Created date is required",
            })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            defaultValue={new Date().toISOString().split("T")[0]} // Default to current date
          />
          {errors.createdDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.createdDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="date"
            {...register("expiryDate", { required: "Expiry date is required" })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.expiryDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            {...register("imageUrl")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
          >
            {isLoading ? "Adding Cake..." : "Add Cake"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCakeContainer;
