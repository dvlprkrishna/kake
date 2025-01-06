/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Replace with your actual Firebase config import

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import {
  ArrowDownZA,
  ArrowUpAZ,
  ArrowUpDown,
  BadgeIndianRupee,
  ChevronLeft,
  ChevronRight,
  Loader,
  RefreshCw,
  Search,
} from "lucide-react"; // Import Lucide icons
import MarkSoldContainer from "@/components/Sales/MarkSoldContainer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Timestamp } from "firebase/firestore";

// Cake Type
type Cake = {
  id: string;
  name: string;
  price: string;
  weight: string;
  sku: string;
  status: string;
  expiry_at: Timestamp | string; // Add expiry date field
  customer?: {
    name: string;
    phone: string;
    sold_at?: Timestamp | string; // Sold date and time
  }; // Nested customer object
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
  const [cakesList, setCakesList] = useState<Cake[]>(cakes);
  const [searchQuery, setSearchQuery] = useState("");

  const [columnVisibility, setColumnVisibility] = useState({});

  const [filteredCakes, setFilteredCakes] = useState<Cake[]>(cakes);

  useEffect(() => {
    if (shouldRefresh) {
      // Fetch the updated list of cakes
      fetchCakes();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  const fetchCakes = async () => {
    const cakesRef = collection(db, "cakes");
    const snapshot = await getDocs(cakesRef);
    const fetchedCakes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Cake[];

    setCakesList(fetchedCakes);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

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

  // Effect to handle search and filter logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCakes(cakes); // Show all cakes if search query is empty
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredCakes(
        cakes.filter(
          (cake) =>
            cake.name.toLowerCase().includes(lowerCaseQuery) ||
            cake.sku.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
  }, [searchQuery, cakes]); // Re-run filter logic when search query or cakes change

  // Function to check and update status
  const updateExpiredStatus = async () => {
    const currentDate = new Date();

    // Loop through cakes and check expiry
    for (const cake of cakes) {
      const expiryAt =
        cake.expiry_at instanceof Timestamp ? cake.expiry_at.toDate() : null;

      if (expiryAt && expiryAt < currentDate && cake.status !== "Expired") {
        // If the expiry date has passed, update the status to "Expired"
        const cakeRef = doc(db, "cakes", cake.id);
        await updateDoc(cakeRef, {
          status: "Expired",
        });

        toast.success(`Cake ${cake.name} status updated to Expired.`);
        window.location.reload();
      }
    }
  };

  // Run the update when cakes are loaded
  useEffect(() => {
    if (!isLoading) {
      updateExpiredStatus();
    }
  }, [cakes, isLoading]);

  useEffect(() => {
    if (shouldRefresh) {
      fetchCakes();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  // Define columns with sorting enabled
  const columns: ColumnDef<Cake>[] = [
    {
      id: "select",
      header: () => <span>Select</span>, // Render JSX directly
      cell: ({ row }) => (
        <input
          type="checkbox"
          onChange={(e) => handleCheckboxChange(e, row.original.id)}
          className="form-checkbox"
          disabled={
            row.original.status === "Sold" || row.original.status === "Expired"
          }
        />
      ),
      enableSorting: false, // Disable sorting for the checkbox column
    },
    { accessorKey: "sku", header: "SKU Id" },
    { accessorKey: "name", header: "Cake Name" },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => `₹${getValue()}`,
    },
    {
      accessorKey: "weight",
      header: "Weight",
      cell: ({ getValue }) => `${getValue()} g`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<string>();
        return (
          <span
            className={`inline-block px-2 py-1 text-xs font-medium ${
              status === "Sold"
                ? "bg-green-100 text-green-600"
                : status === "Expired"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "expiry_at",
      header: "Expiry Date",
      cell: ({ getValue }) => {
        const expiryAt = getValue();

        // If it's a Timestamp, convert it to Date
        if (expiryAt instanceof Timestamp) {
          const date = expiryAt.toDate(); // Convert to Date
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
          const year = date.getFullYear();
          return (
            <span className="inline-block px-2 py-1 text-xs font-medium">{`${day}-${month}-${year}`}</span>
          );
        }

        // If it's a string, display it as is
        if (typeof expiryAt === "string") {
          return (
            <span className="inline-block px-2 py-1 text-xs font-medium">
              {expiryAt}
            </span>
          );
        }

        // Fallback if it's neither a Timestamp nor a string
        return (
          <span className="inline-block px-2 py-1 text-xs font-medium">
            N/A
          </span>
        );
      },
    },
    {
      accessorKey: "customer.name",
      header: "Customer Name",
      cell: ({ row }) => row.original.customer?.name || "N/A", // Safely access nested name
    },
    {
      accessorKey: "customer.sold_at",
      header: "Sales Date",
      cell: ({ row }) => {
        const soldAt = row.original.customer?.sold_at || "N/A";
        if (soldAt instanceof Timestamp) {
          const date = soldAt.toDate();
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        }
        return "N/A";
      },
    },
    {
      accessorKey: "customer.sold_at",
      header: "Sales Time",
      cell: ({ row }) => {
        const soldAt = row.original.customer?.sold_at || "N/A";
        if (soldAt instanceof Timestamp) {
          const date = soldAt.toDate();
          let hours = date.getHours();
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12; // Convert to 12-hour format
          return `${hours}:${minutes} ${ampm}`;
        }
        return "N/A";
      },
    },
  ];

  // Table instance with sorting
  const table = useReactTable({
    data: filteredCakes,
    columns,
    state: {
      columnVisibility, // Pass visibility state
    },
    onColumnVisibilityChange: setColumnVisibility, // Update visibility state
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // Enable sorting
    initialState: {
      pagination: { pageSize: 8, pageIndex: 0 },
      sorting: [{ id: "name", desc: false }], // Default sort state (by name, ascending)
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-4">
        {/* <Image
          width="250"
          height="150"
          src="/assets/cake-placeholder.jpg"
          alt="placeholder"
        /> */}
        <Loader size={64} />
        <p>Loading cakes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-semibold">All Cake List</h2>

      {/* Toggle columns */}
      <div className="mb-4 flex flex-row gap-2 sm:flex-row sm:items-center sm:justify-center">
        <h3 className="font-semibold">Toggle Columns:</h3>
        <div className="flex flex-wrap gap-2">
          {table.getAllLeafColumns().map((column, index) => {
            return (
              <label key={column.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={index !== 0 ? column.getIsVisible() : false}
                  onChange={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                />
                <span>{column.id}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Search / mark as sale / refresh */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-[60%]">
          {/* Lucide icon */}
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by Cake Name or Cake ID"
            className="w-full rounded-lg border border-gray-300 px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={handleSearch} // Handle search input
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Button for marking selected cakes as sold */}
          <Button onClick={handleMarkAsSold} className="mb-4 px-6 py-2 sm:mb-0">
            <BadgeIndianRupee /> Mark as Sold
          </Button>

          {/* New Button to check and update expired cakes */}
          <Button
            onClick={() => window.location.reload()}
            className="mb-4 ml-0 bg-red-500 px-6 py-2 sm:mb-0 sm:ml-4"
          >
            <RefreshCw />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Cake List Table */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100 text-left">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cursor-pointer border-b px-4 py-2"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {/* Handle header as string, JSX, or function */}
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                      {/* Sort Indicator */}
                      {header.column.getIsSorted() === "asc" && (
                        <ArrowUpAZ size={16} className="text-black" />
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <ArrowDownZA size={16} className="text-black" />
                      )}
                      {!header.column.getIsSorted() && (
                        <ArrowUpDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => {
              // Check if the expiry date is past
              const expiryAt = row.original.expiry_at;
              const isExpired =
                expiryAt instanceof Timestamp
                  ? expiryAt.toDate() < new Date() // Compare expiry date with the current date
                  : false;

              return (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${isExpired ? "" : ""}`}
                  style={
                    isExpired
                      ? {
                          background:
                            "repeating-linear-gradient(45deg, #f8c8d1, #f8c8d1 10px, #f2a0c3 10px, #f2a0c3 20px)",
                          backgroundImage:
                            "linear-gradient(45deg, #ffffff 25%, #fff2f2  25%, #fff2f2  50%, #ffffff 50%, #ffffff 75%, #fff2f2  75%, #fff2f2  100%)",
                          backgroundSize: "56.57px 56.57px",
                        }
                      : {}
                  }
                >
                  {/* Table row content */}
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border-b px-4 py-2">
                      {cell.column.columnDef.cell instanceof Function
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue()}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-center gap-x-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="pl-2"
        >
          <ChevronLeft /> Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="pr-2"
        >
          Next <ChevronRight />
        </Button>
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
