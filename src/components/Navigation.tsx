
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check login status from localStorage
    const loginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginStatus === "true");

    // Get cart count from localStorage
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      const cart = JSON.parse(cartData);
      const count = cart.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartItemCount(count);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-xl font-semibold">
            Traditional Elegance
          </a>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className={`hover:text-primary ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}
            >
              Home
            </a>
            <a 
              href="/products" 
              className={`hover:text-primary ${location.pathname === '/products' ? 'text-primary font-medium' : ''}`}
            >
              Products
            </a>
            {isLoggedIn && (
              <a 
                href="/admin" 
                className={`hover:text-primary ${location.pathname === '/admin' ? 'text-primary font-medium' : ''}`}
              >
                Admin
              </a>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            {isLoggedIn ? (
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate("/login")}>
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a 
                href="/" 
                className={`py-2 hover:text-primary ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/products" 
                className={`py-2 hover:text-primary ${location.pathname === '/products' ? 'text-primary font-medium' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </a>
              {isLoggedIn && (
                <a 
                  href="/admin" 
                  className={`py-2 hover:text-primary ${location.pathname === '/admin' ? 'text-primary font-medium' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </a>
              )}
              
              <div className="flex items-center space-x-4 pt-4 border-t">
                <Button variant="ghost" size="icon" onClick={() => {
                  navigate("/cart");
                  setIsMenuOpen(false);
                }}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
                
                {isLoggedIn ? (
                  <Button variant="ghost" onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}>
                    Logout
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}>
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
