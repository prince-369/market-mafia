import { NavLink, useSearchParams } from "react-router-dom";
import { 
  ShoppingCart,
  Smartphone,
  Laptop,
  Camera,
  Car,
  Watch,
  Package 
} from "lucide-react";

const Navbar = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const categories = [
    { id: "all", name: "All", icon: <ShoppingCart className="h-5 w-5" /> },
    { id: "mobiles", name: "Mobiles", icon: <Smartphone className="h-5 w-5" /> },
    { id: "computers", name: "Computers", icon: <Laptop className="h-5 w-5" /> },
    { id: "camera_lens", name: "Camera & Lens", icon: <Camera className="h-5 w-5" /> },
    { id: "vehicles", name: "Vehicles", icon: <Car className="h-5 w-5" /> },
    { id: "accessories", name: "Accessories", icon: <Watch className="h-5 w-5" /> },
    { id: "others", name: "Others", icon: <Package className="h-5 w-5" /> },
  ];

  return (
    <nav className=" text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto py-3 space-x-1 scrollbar-hide">
          {categories.map((category) => (
            <NavLink
              key={category.id}
              to={`?category=${category.id}`} // Changed to relative path
              className={({ isActive }) =>
                `flex items-center space-x-2 whitespace-nowrap px-4 py-2 rounded-md transition-colors ${
                  currentCategory === category.id
                    ? "bg-blue-600 text-white font-medium shadow-inner"
                    : "hover:bg-gray-700 text-gray-300"
                }`
              }
              end
            >
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;