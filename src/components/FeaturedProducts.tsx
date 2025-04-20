
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

const products = [
  {
    id: 1,
    name: "Traditional Silk Saree",
    price: "$299",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Embroidered Lehenga",
    price: "$499",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Handwoven Anarkali",
    price: "$399",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Designer Salwar Suit",
    price: "$259",
    image: "/placeholder.svg"
  }
];

const FeaturedProducts = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Collection</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover our most popular traditional dresses, each piece carefully crafted to celebrate cultural heritage and modern elegance.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-primary">{product.price}</p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" onClick={() => navigate("/products")}>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
