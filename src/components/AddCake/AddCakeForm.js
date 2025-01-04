import { Button, Input, Textarea, Label } from "shadcn"; // Import components from Shadcn

export default function AddCakeForm({ formData, onChange, onSubmit }) {
  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-4 text-2xl font-bold">Add a New Cake</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* SKU Input */}
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            type="text"
            name="sku"
            value={skuID}
            placeholder={skuID}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Cake Name Input */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Cake Type Input */}
        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            type="text"
            name="type"
            value={formData.type}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight">Weight (g)</Label>
          <Input
            id="weight"
            type="text"
            name="weight"
            value={formData.weight}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price Input */}
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Expiry Date Input */}
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description Textarea */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Cake
        </Button>
      </form>
    </div>
  );
}
