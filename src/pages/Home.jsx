import Header from "../components/Header";
import Items from "./items/Items";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Items category={category} />
    </div>
  );
};

export default Home;