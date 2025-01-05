"use client";
import React, { useState, useEffect } from "react"; // Import React hooks
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating unique IDs
import { useForm } from "react-hook-form";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Import your firestore configuration
import { toast } from "sonner";
import { Button } from "../ui/button";

type CakeFormData = {
  name: string;
  price: number;
  description: string;
  weight: number;
  type: string;
  sku: string;
  created_at: string;
  expiry_at: string;
  image: string;
};

const AddCakeContainer = () => {
  const [skuID, setSkuID] = useState<string>("");

  // Generate SKU on component mount
  useEffect(() => {
    setSkuID("K-" + uuidv4().slice(0, 4).toUpperCase());
  }, []);

  const {
    register,
    handleSubmit,
    setValue, // Use this to programmatically set field values
    formState: { errors },
    reset,
  } = useForm<CakeFormData>();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Update SKU field when skuID changes
  useEffect(() => {
    if (skuID) {
      setValue("sku", skuID); // Dynamically set SKU in the form
    }
  }, [skuID, setValue]);

  const onSubmit = async (data: CakeFormData) => {
    setIsLoading(true);
    setErrorMessage("");

    const createdAt = new Date(); // Set the creation date to the current date
    const expiryAt = new Date(data.expiry_at);

    if (isNaN(expiryAt.getTime())) {
      setErrorMessage("Invalid expiry date format. Please check the input.");
      setIsLoading(false);
      return;
    }

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
        status: "Available",
        created_at: createdAt,
        expiry_at: expiryAt,
      });
      reset(); // Reset form after successful submission
      toast.success("Cake added successfully!");
      setSkuID("K-" + uuidv4().slice(0, 4).toUpperCase()); // Generate a new SKU for the next entry
    } catch (error) {
      setErrorMessage("Error adding cake. Please try again. " + error);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-semibold">Add New Cake</h2>
      <div className="mx-auto w-full max-w-full rounded-lg border bg-white p-6">
        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cake Name
            </label>
            <input
              type="text"
              placeholder="Ex. Dutch Truffle"
              {...register("name", { required: "Cake name is required" })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Ex. A delicious chocolate cake"
              {...register("description", {
                required: "Description is required",
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                placeholder="Ex. 1499"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 1, message: "Price must be greater than 0" },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight (gm)
              </label>
              <input
                placeholder="Ex. 1500"
                type="number"
                {...register("weight", {
                  required: "Weight is required",
                  min: { value: 0.1, message: "Weight must be greater than 0" },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
              {errors.weight && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                {...register("type", { required: "Cake type is required" })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Eggless">Eggless</option>
                <option value="Egg">Egg</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                {...register("sku", { required: "SKU is required" })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                value={skuID} // Bind the generated SKU to the input field
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                {...register("image", { required: "Image URL is required" })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                defaultValue="http://localhost:3000/assets/cake-placeholder.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                {...register("expiry_at", {
                  required: "Expiry date is required",
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                defaultValue={
                  new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                } // Default to 3 days from now
              />
              {errors.expiry_at && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.expiry_at.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              type="button"
              onClick={() => reset()}
              className="mr-4 w-max rounded-md px-4 py-2"
            >
              Reset
            </Button>
            <Button
              variant="default"
              type="submit"
              disabled={isLoading}
              className="w-max rounded-md px-8 py-2 text-white disabled:bg-gray-400"
            >
              {isLoading ? "Adding Cake..." : "Add Cake"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCakeContainer;
