import { MessageCircle, MapPin } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

// Mock data with multiple images
export const allItems = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    price: "₹99,999",
    category: "mobiles",
    coverImage: "https://m.media-amazon.com/images/I/61l9ppRIiqL._SL1500_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61l9ppRIiqL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71T5NVOgbpL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71xb2xkN5qL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61cwywLZR-L._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61BGE6iu4AL._SL1500_.jpg"
    ],
    location: "New Delhi, India",
    description: "Latest iPhone with A16 Bionic chip and 48MP camera"
  },
  {
    id: 2,
    title: "MacBook Air M2",
    price: "₹1,09,990",
    category: "computers",
    coverImage: "https://m.media-amazon.com/images/I/71f5Eu5lJSL._SL1500_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71f5Eu5lJSL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71TPda7cwUL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71iX2bG0-tL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71LJJrKbezL._SL1500_.jpg"
    ],
    location: "Bangalore, India",
    description: "Ultra-thin laptop with M2 chip and 18-hour battery"
  }

];

const Items = ({ category = "all" }) => {
  const navigate = useNavigate();
  const filteredItems = category === "all" 
    ? allItems 
    : allItems.filter(item => item.category === category);

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="mb-6"><Navbar/></div>
      
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 capitalize">
        {category === "all" ? "All Products" : category.replace('_', ' ')}
        <span className="text-gray-400 text-sm ml-2">({filteredItems.length} items)</span>
      </h1>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No items found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="relative h-48 overflow-hidden group">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center text-white text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white truncate">{item.title}</h3>
                <p className="text-blue-400 font-medium mt-1">{item.price}</p>
                
                <div className="mt-4 flex justify-end">
                  <button 
                    className="text-gray-300 hover:text-white p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center"
                    title="Chat with seller"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle chat functionality here
                    }}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Items;