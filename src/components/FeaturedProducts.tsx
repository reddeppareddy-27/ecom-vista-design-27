
import { Card, CardContent, CardFooter } from "./ui/card"

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
]

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-primary">{product.price}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
