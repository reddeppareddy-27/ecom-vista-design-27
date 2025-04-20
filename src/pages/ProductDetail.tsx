
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  longDescription?: string;
}

// Demo product data
const productData: Product[] = [
  {
    id: 1,
    name: "Traditional Silk Saree",
    price: 299,
    description: "Handcrafted silk saree with intricate embroidery",
    longDescription: "This exquisite handcrafted silk saree features intricate embroidery work done by skilled artisans. The fabric is of premium quality, ensuring both comfort and elegance. Perfect for special occasions and celebrations, this saree combines traditional craftsmanship with contemporary design elements.",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Embroidered Lehenga",
    price: 499,
    description: "Elegant lehenga with detailed embroidery work",
    longDescription: "This stunning embroidered lehenga showcases meticulous craftsmanship and attention to detail. Featuring elaborate patterns and premium quality fabric, it's designed to make you the center of attention at any event. The rich embroidery and vibrant colors reflect traditional aesthetics while maintaining a modern appeal.",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Handwoven Anarkali",
    price: 399,
    description: "Beautiful handwoven anarkali suit",
    longDescription: "This beautiful handwoven anarkali suit represents the pinnacle of traditional craftsmanship. Each piece is carefully created by skilled weavers using time-honored techniques. The flowing silhouette and intricate patterns make this anarkali a true statement piece for special occasions.",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Designer Salwar Suit",
    price: 259,
    description: "Stylish designer salwar suit with modern patterns",
    longDescription: "This stylish designer salwar suit combines traditional elements with contemporary designs. The modern patterns and color combinations offer a fresh take on classic attire. Made from high-quality fabrics, this outfit provides both comfort and elegance for everyday wear and special occasions.",
    image: "/placeholder.svg"
  }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this would fetch from an API/Supabase
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      if (id) {
        const foundProduct = productData.find(p => p.id === parseInt(id));
        setProduct(foundProduct || null);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    if (!product) return;
    
    // Get current cart from localStorage
    const currentCart = localStorage.getItem("cart");
    let cart = currentCart ? JSON.parse(currentCart) : [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingProductIndex >= 0) {
      // Update quantity if product already exists
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Add new product with specified quantity
      cart.push({ ...product, quantity });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} (Qty: ${quantity}) added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
          <p className="mb-8 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <Button 
          variant="ghost" 
          className="mb-8"
          onClick={() => navigate("/products")}
        >
          ← Back to Products
        </Button>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-primary font-semibold mb-4">${product.price}</p>
            <div className="border-t border-b py-4 my-6">
              <p className="text-gray-700">{product.longDescription || product.description}</p>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2">Quantity</label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1"
                onClick={addToCart}
              >
                Add to Cart
              </Button>
              <Button 
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  addToCart();
                  navigate("/cart");
                }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
