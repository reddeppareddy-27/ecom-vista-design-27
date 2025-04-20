
import { ShoppingCart, Search } from "lucide-react"
import { Button } from "./ui/button"

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-xl font-semibold">
            Traditional Elegance
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="hover:text-primary">Home</a>
            <a href="/collection" className="hover:text-primary">Collection</a>
            <a href="/about" className="hover:text-primary">About</a>
            <a href="/contact" className="hover:text-primary">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
