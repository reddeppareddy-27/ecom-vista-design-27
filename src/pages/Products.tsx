
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { productsAPI } from "@/api/client";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // For now, we'll use static data, but this would be replaced with API call:
        // const data = await productsAPI.getAll();
        // setProducts(data);
        
        // Static data for demonstration
        setProducts([
          {
            id: 1,
            name: "Traditional Silk Saree",
            price: 299,
            description: "Handcrafted silk saree with intricate embroidery",
            image: "/placeholder.svg"
          },
          {
            id: 2,
            name: "Embroidered Lehenga",
            price: 499,
            description: "Elegant lehenga with detailed embroidery work",
            image: "/placeholder.svg"
          },
          {
            id: 3,
            name: "Handwoven Anarkali",
            price: 399,
            description: "Beautiful handwoven anarkali suit",
            image: "/placeholder.svg"
          },
          {
            id: 4,
            name: "Designer Salwar Suit",
            price: 259,
            description: "Stylish designer salwar suit with modern patterns",
            image: "/placeholder.svg"
          },
          {
            id: 5,
            name: "Bridal Collection Saree",
            price: 599,
            description: "Luxurious bridal saree with gold embellishments",
            image: "/placeholder.svg"
          },
          {
            id: 6,
            name: "Casual Ethnic Kurta",
            price: 129,
            description: "Comfortable casual kurta for everyday wear",
            image: "/placeholder.svg"
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    // Get current cart from localStorage
    const currentCart = localStorage.getItem("cart");
    let cart = currentCart ? JSON.parse(currentCart) : [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingProductIndex >= 0) {
      // Increment quantity if product already exists
      cart[existingProductIndex].quantity += 1;
    } else {
      // Add new product with quantity 1
      cart.push({ ...product, quantity: 1 });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Products</h1>
          <div className="animate-pulse">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Our Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <div className="flex justify-between w-full mt-4 items-center">
                  <p className="text-primary font-semibold">${product.price}</p>
                  <Button onClick={() => addToCart(product)} size="sm">Add to Cart</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
