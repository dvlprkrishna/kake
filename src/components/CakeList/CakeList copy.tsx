"use client";
// components/CakeList.tsx

import { useRouter } from "next/navigation";

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
  const router = useRouter();
  if (isLoading) return <div>Loading...</div>;
  const handleMarkSale = (cakeId: string) => {
    // Navigate to the Sales page, passing the cakeId
    router.push(`/sales/${cakeId}`);
  };
  return (
    <div>
      <h2>All Cakes</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Weight</th>
            <th>SKU</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cakes.map((cake) => (
            <tr key={cake.id}>
              <td>{cake.name}</td>
              <td>{cake.price}</td>
              <td>{cake.weight}</td>
              <td>{cake.sku}</td>
              <td>{cake.status}</td>
              {/* <td>
                <button onClick={() => alert(`Edit cake ${cake.id}`)}>
                  Edit
                </button>
                <button onClick={() => alert(`Delete cake ${cake.id}`)}>
                  Delete
                </button>
              </td> */}
              <td>
                <button onClick={() => handleMarkSale(cake.id)}>
                  Mark as Sold
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CakeList;
