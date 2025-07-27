import { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, ChevronLeft, ChevronRight,MessageCircle } from "lucide-react";

// Use the same mock data as in Items.jsx
import { allItems } from "./Items";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const item = allItems.find(item => item.id === Number(id));

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === item.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? item.images.length - 1 : prevIndex - 1
    );
  };

  if (!item) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white">Item not found</h1>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-300 hover:text-white mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Products
      </button>

      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg max-w-6xl mx-auto">
        <div className="md:flex">
          {/* Image Gallery Section */}
          <div className="md:w-1/2 relative">
            <div className="relative h-96 overflow-hidden">
              <img
                src={item.images[currentImageIndex]}
                alt={`${item.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain bg-black"
              />
              
              {/* Navigation Arrows */}
              {item.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {item.images.length > 1 && (
              <div className="flex p-2 space-x-2 overflow-x-auto bg-gray-900">
                {item.images.slice(0, 5).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 ${currentImageIndex === index ? 'ring-2 ring-blue-500' : 'opacity-70'}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-6 md:w-1/2">
            <h1 className="text-2xl font-bold text-white mb-2">{item.title}</h1>
            <p className="text-blue-400 text-xl font-medium mb-4">{item.price}</p>
            
            <div className="flex items-center text-gray-300 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{item.location}</span>
            </div>
            
            <p className="text-gray-300 mb-6">{item.description}</p>
            
            <div className="mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md w-full mb-3">
                Contact Seller
              </button>
              <button className="text-gray-300 hover:text-white p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-300 w-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;