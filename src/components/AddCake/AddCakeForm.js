import { Button, Input, Textarea, Label } from "shadcn"; // Import components from Shadcn

export default function AddCakeForm({ formData, onChange, onSubmit }) {
  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Cake</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* SKU Input */}
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            type="text"
            name="sku"
            value={formData.sku}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Cake
        </Button>
      </form>
    </div>
  );
}
