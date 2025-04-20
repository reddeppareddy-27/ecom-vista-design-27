
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative h-[90vh] flex items-center bg-gradient-to-r from-neutral-100 to-neutral-200">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Timeless Traditional Dresses
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore our collection of handcrafted traditional dresses, bringing heritage and elegance to modern fashion.
          </p>
          <Button size="lg" className="text-lg" onClick={() => navigate("/products")}>
            Shop Collection
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Hero
