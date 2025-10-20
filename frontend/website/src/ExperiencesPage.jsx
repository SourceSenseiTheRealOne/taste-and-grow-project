import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Sprout, Package, Truck, Utensils, Heart, Menu, X, Wheat, Droplet, Citrus } from 'lucide-react'
import './App.css'

function ExperiencesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Sprout className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">Taste & Grow</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Home</a>
              <a href="/experiences" className="text-green-600 font-medium border-b-2 border-green-600">Experiences</a>
              <a href="/#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">How It Works</a>
              <a href="/#contact" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Contact</a>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Register Your Class</Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav className="flex flex-col space-y-4">
                <a href="/" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Home</a>
                <a href="/experiences" className="text-green-600 font-medium">Experiences</a>
                <a href="/#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">How It Works</a>
                <a href="/#contact" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Contact</a>
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full">Register Your Class</Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="section-padding pt-32 bg-gradient-to-br from-amber-50 via-green-50 to-sky-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-800">
            Explore Experiences
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-3xl mx-auto italic font-semibold">
            Built for schools. Inspired by nature.
          </p>

          <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto">
            Taste & Grow brings the finest ingredients straight from local farms into classrooms, homes, and communities — helping everyone rediscover where real food comes from.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Register Your Class
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Order for Home Delivery
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Cards Section */}
      <section id="experiences" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Card 1 - Heritage Flours */}
            <Card className="card-legendary hover-lift overflow-hidden">
              <div className="w-full h-64 overflow-hidden bg-gradient-to-br from-amber-100 to-amber-50 relative">
                <img 
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop" 
                  alt="Heritage Flours" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <Wheat className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  Heritage Flours Experience
                </CardTitle>
                <div className="text-3xl font-bold text-amber-600 mb-2">€20</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Discover ancient grains — <strong>Barbela wheat</strong> and <strong>Preto Amarelo corn</strong> — grown by small family farmers and stone-milled with care. These flours are rich in flavor, naturally lower in gluten, and gentle on the gut.
                </p>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm font-semibold text-amber-900 mb-1">Includes:</p>
                  <p className="text-sm text-amber-800">1 kg Barbela flour + 1 kg Preto Amarelo corn flour (2 kg total)</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">🌱 Learn:</p>
                  <p className="text-sm text-gray-600">Explore how ancestral grains protect biodiversity and nourish soil health.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">🍪 Classroom Activity:</p>
                  <p className="text-sm text-gray-600">Create simple cookies, muffins, or healthy cakes using our classroom recipe cards.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            {/* Card 2 - Olive Oil */}
            <Card className="card-rare hover-lift overflow-hidden">
              <div className="w-full h-64 overflow-hidden bg-gradient-to-br from-green-100 to-green-50 relative">
                <img 
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=600&fit=crop" 
                  alt="Olive Oil" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                  <Droplet className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  Olive Oil Experience
                </CardTitle>
                <div className="text-lg font-bold text-green-700 mb-2">
                  500 ml: €15 | 3 L tin: €39
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Taste smooth, aromatic olive oil from <strong>Cabeço das Nogueiras</strong>, produced through traditional cold pressing. Each bottle captures the essence of sustainable groves and generations of craftsmanship.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">🌿 Learn:</p>
                  <p className="text-sm text-gray-600">From grove to bottle — discover how early harvest, pressing time, and terroir shape flavor and nutrition.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">👃 Classroom Activity:</p>
                  <p className="text-sm text-gray-600">Olive oil tasting wheel or "Guess the Flavor" sensory challenge.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            {/* Card 3 - Northern Citrus */}
            <Card className="card-epic hover-lift overflow-hidden">
              <div className="w-full h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 relative">
                <img 
                  src="https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&h=600&fit=crop" 
                  alt="Northern Citrus" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  <Citrus className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  Northern Citrus Experience
                </CardTitle>
                <div className="text-3xl font-bold text-blue-600 mb-2">€24</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  A vibrant mix of fresh and dried rare citrus fruits — <strong>Bergamota, Calamondine, Kumquat, Lemonquat, Buddha's Hand, Chocolate Oranges</strong>, and more. Each fruit offers its own aroma, acidity, and character.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Includes:</p>
                  <p className="text-sm text-blue-800">Premium mixed selection of seasonal citrus (fresh & dried)</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">🍊 Learn:</p>
                  <p className="text-sm text-gray-600">How ripening, aroma, and natural compounds make citrus one of nature's most diverse fruits.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">🔬 Classroom Activity:</p>
                  <p className="text-sm text-gray-600">"Taste Lab" — students rate flavor, aroma, and texture like real chefs.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="section-padding bg-gradient-to-br from-amber-50 to-green-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
            Why It Matters
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
            We believe in learning by tasting. Each Taste & Grow experience connects schools and families to real food stories — supporting local farmers, protecting biodiversity, and helping kids rediscover the joy of natural flavor.
          </p>
          <div className="flex justify-center gap-8 text-6xl">
            <span className="animate-float">🌿</span>
            <span className="animate-float" style={{animationDelay: '0.2s'}}>🌾</span>
            <span className="animate-float" style={{animationDelay: '0.4s'}}>🍊</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="group">
              <Card className="step-card h-full hover-lift">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    Choose Your Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Heritage Flours, Olive Oil, or Northern Citrus.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Step 2 */}
            <div className="group">
              <Card className="step-card h-full hover-lift">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Truck className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    Receive Your Box
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Delivered to your school or home.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Step 3 */}
            <div className="group">
              <Card className="step-card h-full hover-lift">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Utensils className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    Taste & Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Use our guides and classroom ideas.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Step 4 */}
            <div className="group">
              <Card className="step-card h-full hover-lift">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    Share the Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Every order supports Portuguese farmers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-br from-amber-50 via-green-50 to-sky-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
            Ready to Begin?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Register Your Class
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Order for Home Delivery
            </Button>
          </div>

          <p className="text-gray-600 text-lg">
            Every purchase supports local farmers and protects food biodiversity.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sprout className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold">Taste & Grow</span>
              </div>
              <p className="text-gray-300 italic">
                Celebrating biodiversity through taste, one experience at a time.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-green-400 transition-colors">Home</a></li>
                <li><a href="/experiences" className="text-gray-300 hover:text-green-400 transition-colors">Experiences</a></li>
                <li><a href="/#how-it-works" className="text-gray-300 hover:text-green-400 transition-colors">How It Works</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">
                Email: <a href="mailto:hello@tasteandgrow.com" className="text-green-400 hover:underline">hello@tasteandgrow.com</a>
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Taste & Grow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ExperiencesPage

