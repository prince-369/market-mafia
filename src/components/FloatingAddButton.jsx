import { Plus } from 'lucide-react';
import { useState } from 'react';

const FloatingAddButton = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
      >
        <Plus className="h-8 w-8" />
      </button>

      {/* Add Product Form (will implement later) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Add New Product</h2>
            {/* Form will go here */}
            <button 
              onClick={() => setShowForm(false)}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAddButton;