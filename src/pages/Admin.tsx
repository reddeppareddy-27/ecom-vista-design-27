
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2 } from "lucide-react";

interface Order {
  id: number;
  customerName: string;
  email: string;
  total: number;
  status: string;
  date: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: "",
    price: 0,
    description: "",
    image: "/placeholder.svg",
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Load demo data
  useEffect(() => {
    // Mock orders data
    const mockOrders: Order[] = [
      {
        id: 1,
        customerName: "Jane Smith",
        email: "jane@example.com",
        total: 299,
        status: "Delivered",
        date: "2023-04-15",
      },
      {
        id: 2,
        customerName: "John Doe",
        email: "john@example.com",
        total: 499,
        status: "Processing",
        date: "2023-04-16",
      },
      {
        id: 3,
        customerName: "Sarah Johnson",
        email: "sarah@example.com",
        total: 399,
        status: "Shipped",
        date: "2023-04-14",
      },
    ];

    // Mock products data
    const mockProducts: Product[] = [
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
    ];

    setOrders(mockOrders);
    setProducts(mockProducts);
  }, []);

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [name]: name === 'price' ? parseFloat(value) : value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: name === 'price' ? parseFloat(value) : value,
      });
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      toast({
        title: "Invalid input",
        description: "Please fill all fields with valid values",
        variant: "destructive",
      });
      return;
    }

    const id = Math.max(0, ...products.map(p => p.id)) + 1;
    const product = { id, ...newProduct };
    
    setProducts([...products, product]);
    setNewProduct({
      name: "",
      price: 0,
      description: "",
      image: "/placeholder.svg",
    });
    
    toast({
      title: "Product added",
      description: `${product.name} has been added to your inventory`,
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;

    if (!editingProduct.name || !editingProduct.description || editingProduct.price <= 0) {
      toast({
        title: "Invalid input",
        description: "Please fill all fields with valid values",
        variant: "destructive",
      });
      return;
    }

    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    
    toast({
      title: "Product updated",
      description: `${editingProduct.name} has been updated`,
    });
  };

  const handleDeleteProduct = (id: number) => {
    const productToDelete = products.find(p => p.id === id);
    
    setProducts(products.filter(p => p.id !== id));
    
    toast({
      title: "Product deleted",
      description: `${productToDelete?.name} has been removed from your inventory`,
    });
  };

  const handleUpdateOrderStatus = (id: number, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    
    toast({
      title: "Order updated",
      description: `Order #${id} status changed to ${newStatus}`,
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="orders">
          <TabsList className="mb-8">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>${order.total}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, "Processing")}
                              disabled={order.status === "Processing"}
                            >
                              Process
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, "Shipped")}
                              disabled={order.status === "Shipped" || order.status === "Delivered"}
                            >
                              Ship
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, "Delivered")}
                              disabled={order.status === "Delivered"}
                            >
                              Complete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={editingProduct ? editingProduct.name : newProduct.name} 
                        onChange={handleProductChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        value={editingProduct ? editingProduct.price : newProduct.price} 
                        onChange={handleProductChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description" 
                        name="description" 
                        value={editingProduct ? editingProduct.description : newProduct.description} 
                        onChange={handleProductChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input 
                        id="image" 
                        name="image" 
                        value={editingProduct ? editingProduct.image : newProduct.image} 
                        onChange={handleProductChange} 
                        placeholder="/placeholder.svg"
                      />
                    </div>
                    
                    <div className="pt-4">
                      {editingProduct ? (
                        <div className="flex gap-2">
                          <Button onClick={handleEditProduct}>Update Product</Button>
                          <Button variant="ghost" onClick={() => setEditingProduct(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <Button onClick={handleAddProduct}>Add Product</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Product Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>#{product.id}</TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setEditingProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
