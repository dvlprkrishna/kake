"use client";
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { MoveDown, MoveUp } from "lucide-react"; // Import Lucide icons
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

  // Define columns with sorting enabled
  const columns: ColumnDef<Cake>[] = [
    {
      id: "select",
      header: () => <></>, // Empty header for the checkbox column
      cell: ({ row }) => (
        <input
          type="checkbox"
          onChange={(e) => handleCheckboxChange(e, row.original.id)}
          className="form-checkbox"
          disabled={row.original.status === "Sold"}
        />
      ),
      enableSorting: false, // Disable sorting for the checkbox column
    },
    { accessorKey: "sku", header: "Id" },
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
  ];

  // Table instance with sorting
  const table = useReactTable({
    data: cakes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // Enable sorting
    initialState: {
      pagination: { pageSize: 8, pageIndex: 0 },
      sorting: [{ id: "name", desc: false }], // Default sort state (by name, ascending)
    },
  });

  if (isLoading) {
    return <p>Loading cakes...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-semibold">Cake List</h2>

      {/* Button for marking selected cakes as sold */}
      <Button onClick={handleMarkAsSold} className="mb-4 px-6 py-2">
        Mark as Sold
      </Button>

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
                      {header.isPlaceholder
                        ? null
                        : header.column.columnDef.header instanceof Function
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                      {/* Sort Indicator */}
                      {header.column.getIsSorted() === "asc" && (
                        <MoveUp size={16} className="text-black" />
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <MoveDown size={16} className="text-black" />
                      )}
                      {!header.column.getIsSorted() && (
                        <MoveUp size={16} className="text-gray-400" />
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
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
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
