import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Sprout, Users, ShoppingCart, TrendingUp, Wheat, Droplet, Citrus, Menu, X, Package, LogOut, User as UserIcon } from 'lucide-react';
import ancestralFloursImg from '../assets/ancestral-flours.png';
import oliveOilImg from '../assets/olive-oil.png';
import exoticCitrusImg from '../assets/exotic-citrus.png';
import heritageWheatVideo from '../assets/heritage-wheats.mp4';
import rareOliveOilVideo from '../assets/rare-olive-oil.mp4';
import exoticCitrusVideo from '../assets/exotic-citrus.mp4';
import seedGuardiansImg from '../assets/CoverSeedGuardians.png';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWheatVideoPlaying, setIsWheatVideoPlaying] = useState(false);
  const [isOliveVideoPlaying, setIsOliveVideoPlaying] = useState(false);
  const [isCitrusVideoPlaying, setIsCitrusVideoPlaying] = useState(false);
  const wheatVideoRef = useRef(null);
  const oliveVideoRef = useRef(null);
  const citrusVideoRef = useRef(null);
  const heroWords = ['Grow', 'Play', 'Learn', 'Taste'];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % heroWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleWheatCardHover = () => {
    setIsWheatVideoPlaying(true);
    if (wheatVideoRef.current) {
      wheatVideoRef.current.currentTime = 0;
      wheatVideoRef.current.play().catch(err => console.log('Video play error:', err));
    }
  };

  const handleWheatCardLeave = () => {
    setIsWheatVideoPlaying(false);
    if (wheatVideoRef.current) {
      wheatVideoRef.current.pause();
      wheatVideoRef.current.currentTime = 0;
    }
  };

  const handleWheatCardClick = () => {
    if (isWheatVideoPlaying) {
      handleWheatCardLeave();
    } else {
      handleWheatCardHover();
    }
  };

  const handleOliveCardHover = () => {
    setIsOliveVideoPlaying(true);
    if (oliveVideoRef.current) {
      oliveVideoRef.current.currentTime = 0;
      oliveVideoRef.current.play().catch(err => console.log('Video play error:', err));
    }
  };

  const handleOliveCardLeave = () => {
    setIsOliveVideoPlaying(false);
    if (oliveVideoRef.current) {
      oliveVideoRef.current.pause();
      oliveVideoRef.current.currentTime = 0;
    }
  };

  const handleOliveCardClick = () => {
    if (isOliveVideoPlaying) {
      handleOliveCardLeave();
    } else {
      handleOliveCardHover();
    }
  };

  const handleCitrusCardHover = () => {
    setIsCitrusVideoPlaying(true);
    if (citrusVideoRef.current) {
      citrusVideoRef.current.currentTime = 0;
      citrusVideoRef.current.play().catch(err => console.log('Video play error:', err));
    }
  };

  const handleCitrusCardLeave = () => {
    setIsCitrusVideoPlaying(false);
    if (citrusVideoRef.current) {
      citrusVideoRef.current.pause();
      citrusVideoRef.current.currentTime = 0;
    }
  };

  const handleCitrusCardClick = () => {
    if (isCitrusVideoPlaying) {
      handleCitrusCardLeave();
    } else {
      handleCitrusCardHover();
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
              <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Home</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">How It Works</a>
              <a href="#food-kits" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Food Kits</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Contact</a>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => navigate('/login')} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Login / Signup
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Home</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">How It Works</a>
                <a href="#food-kits" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Food Kits</a>
                <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Contact</a>
                
                {user ? (
                  <>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Button 
                      onClick={handleLogout}
                      variant="outline" 
                      className="w-full text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => navigate('/login')} 
                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                  >
                    Login / Signup
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Rest of the content - same as before but starting from Hero Section */}
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200/50 via-green-50/30 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gray-800 flex flex-wrap justify-center gap-3">
            <span className="inline-block text-gray-800 animate-subtle-bounce" style={{animationDelay: '0s'}}>
              Play.
            </span>
            <span className="inline-block text-green-600 animate-subtle-bounce" style={{animationDelay: '0.3s'}}>
              Learn.
            </span>
            <span className="inline-block text-amber-600 animate-subtle-bounce" style={{animationDelay: '0.6s'}}>
              Taste.
            </span>
            <span className="inline-block text-blue-600 animate-subtle-bounce" style={{animationDelay: '0.9s'}}>
              Grow.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-4 leading-relaxed max-w-3xl mx-auto">
            Taste & Grow helps schools turn real food into learning and fundraising — with students leading their own school e-market and families ordering online.
          </p>
          <p className="text-lg md:text-xl text-gray-900 mb-12 max-w-3xl mx-auto italic font-semibold">
            Built for schools. Inspired by nature.
          </p>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={() => user ? navigate('/register-school') : navigate('/register')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {user ? 'Register Your School' : 'Get Started'}
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section - same as before */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-800">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Each school runs a school e-market where students take the lead, families order online, and everyone shares in the experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="group">
              <Card className="h-full hover-lift border-2 hover:border-green-400 transition-all duration-300 bg-white">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Sprout className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-green-600 mb-2">1</div>
                  <CardTitle className="text-xl font-bold mb-4">Teacher Registers</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">Have your class take the lead. Choose one of the three food kits and pick your preferred date.</p>
                </CardContent>
              </Card>
            </div>

            {/* Step 2 - Parents Buy Online */}
            <div className="group">
              <Card className="h-full hover-lift border-2 hover:border-amber-400 transition-all duration-300 bg-white">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-amber-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ShoppingCart className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-amber-600 mb-2">2</div>
                  <CardTitle className="text-xl font-bold mb-4">Parents Buy Online</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">Families order easily through a QR code. We deliver everything directly to the school, ready for the big day.</p>
                </CardContent>
              </Card>
            </div>

            {/* Step 3 - Class Packs & Leads */}
            <div className="group">
              <Card className="h-full hover-lift border-2 hover:border-blue-400 transition-all duration-300 bg-white">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-blue-600 mb-2">3</div>
                  <CardTitle className="text-xl font-bold mb-4">Students Lead the Market</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">Students pack, present, and share what they've learned — turning their classroom into a mini market stand.</p>
                </CardContent>
              </Card>
            </div>

            {/* Step 4 */}
            <div className="group">
              <Card className="h-full hover-lift border-2 hover:border-purple-400 transition-all duration-300 bg-white">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-purple-600 mb-2">4</div>
                  <CardTitle className="text-xl font-bold mb-4">School Grows</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">Each order raises funds and builds community through real, hands-on learning.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => user ? navigate('/register-school') : navigate('/register')}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Your First Food Kit
            </Button>
          </div>
        </div>
      </section>

      {/* Food Kits Section */}
      <section id="food-kits" className="section-padding bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-800">
            Real Superfoods. Real Learning. Real Impact.
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-4xl mx-auto">
            Each Superfood Kit connects classrooms to powerful foods, inspiring students to explore their origins, taste their benefits, and share their story. It's time to Play, Learn, Taste, and Grow!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Card 1 - Ancestral Flours with Netflix-style video */}
            <Card 
              className="card-legendary hover-lift overflow-hidden"
              onMouseEnter={handleWheatCardHover}
              onMouseLeave={handleWheatCardLeave}
              onClick={handleWheatCardClick}
            >
              <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-amber-100 to-amber-50 relative">
                <img 
                  src={ancestralFloursImg} 
                  alt="Ancestral Flours" 
                  className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${isWheatVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
                />
                <video
                  ref={wheatVideoRef}
                  src={heritageWheatVideo}
                  className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${isWheatVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
                  muted
                  playsInline
                  webkit-playsinline="true"
                  x-webkit-airplay="allow"
                  preload="metadata"
                  loop={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                />
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full flex items-center justify-center shadow-lg animate-glow">
                  <Wheat className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">🌾 Heritage Flours</CardTitle>
                <CardDescription className="text-sm">
                  <div className="font-semibold text-purple-600">🟣 Legendary (1,200 years old)</div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Varieties:</p>
                  <p className="text-sm text-gray-600">Barbela • Preto Amarelo</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Scientific Name:</p>
                  <p className="text-sm text-gray-600 italic">Triticum aestivum (Barbela line)</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-700">
                    These ancient grains were almost lost to time. Now they're grown again — rich in flavor, fiber, and history.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                  Unlock the Ancestral Seed
                </Button>
              </CardFooter>
            </Card>

            {/* Card 2 - Rare Olive Oil with Netflix-style video */}
            <Card 
              className="card-rare hover-lift overflow-hidden"
              onMouseEnter={handleOliveCardHover}
              onMouseLeave={handleOliveCardLeave}
              onClick={handleOliveCardClick}
            >
              <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-green-100 to-green-50 relative">
                <img 
                  src={oliveOilImg} 
                  alt="Rare Olive Oil" 
                  className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${isOliveVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
                />
                <video
                  ref={oliveVideoRef}
                  src={rareOliveOilVideo}
                  className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${isOliveVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
                  muted
                  playsInline
                  webkit-playsinline="true"
                  x-webkit-airplay="allow"
                  preload="metadata"
                  loop={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                />
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                  <Droplet className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">🫒 Olive Oil</CardTitle>
                <CardDescription className="text-sm">
                  <div className="font-semibold text-amber-600">🟡 Premium</div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Varieties:</p>
                  <p className="text-sm text-gray-600">Galega • Cobrançosa • Cordovil • Arbequina</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Scientific Name:</p>
                  <p className="text-sm text-gray-600 italic">Olea europaea</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-700">
                    Each bottle tells a story of growers who protect their trees and the land for future generations.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Unlock the Rare Seed
                </Button>
              </CardFooter>
            </Card>

            {/* Card 3 - Exotic Citrus with Netflix-style video */}
            <Card 
              className="card-epic hover-lift overflow-hidden"
              onMouseEnter={handleCitrusCardHover}
              onMouseLeave={handleCitrusCardLeave}
              onClick={handleCitrusCardClick}
            >
              <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 relative">
                <img 
                  src={exoticCitrusImg} 
                  alt="Exotic Citrus" 
                  className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${isCitrusVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
                />
                <video
                  ref={citrusVideoRef}
                  src={exoticCitrusVideo}
                  className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${isCitrusVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
                  muted
                  playsInline
                  webkit-playsinline="true"
                  x-webkit-airplay="allow"
                  preload="metadata"
                  loop={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse z-10">
                  COMING SOON!
                </div>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  <Citrus className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">🍊 Rare Citrus</CardTitle>
                <CardDescription className="text-sm">
                  <div className="font-semibold text-blue-600">🔵 Epic</div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Varieties:</p>
                  <p className="text-sm text-gray-600">Bergamota • Calamondine • Kumquat • Lemonquat • Buddha's Hand</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Scientific Name:</p>
                  <p className="text-sm text-gray-600 italic">Citrus spp.</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-700">
                    Colorful, fragrant fruits that surprise every sense. A fun way for students to explore biodiversity.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Unlock the Hidden Seed
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Simple to Run Section */}
      <section className="section-padding bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-800">
            Simple to Run. Meaningful to Share.
          </h2>
          <p className="text-lg md:text-xl text-center text-gray-600 mb-16 max-w-4xl mx-auto">
            Your school's e-market is more than a fundraiser — it's a bridge between students, families, and the real stories behind food.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 - Ready in Minutes */}
            <div className="group">
              <Card className="h-full hover-lift border-2 hover:border-green-400 transition-all duration-300 bg-white">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ShoppingCart className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-4">🛒 Ready in Minutes</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">We set up your school's online shop and QR code so families can order easily.</p>
                </CardContent>
              </Card>
            </div>

            {/* Column 2 - Delivered Together */}
            <div className="group">
              <Card className="h-full hover-lift border-2 hover:border-amber-400 transition-all duration-300 bg-white">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-amber-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-4">📦 Delivered Together</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">All food kits arrive grouped by school, ready to hand out on your chosen date.</p>
                </CardContent>
              </Card>
            </div>

            {/* Column 3 - Led by Students */}
            <div className="group">
              <Card className="h-full hover-lift border-2 hover:border-blue-400 transition-all duration-300 bg-white">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-4">👩‍🏫 Led by Students</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">Classes take turns running the market, building teamwork, responsibility, and communication skills.</p>
                </CardContent>
              </Card>
            </div>

            {/* Column 4 - Funds That Grow */}
            <div className="group">
              <Card className="h-full hover-lift border-2 hover:border-purple-400 transition-all duration-300 bg-white">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-4">💰 Funds That Grow</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">Your school chooses its own margin per item — raising money while learning through real-world experience.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => user ? navigate('/register-school') : navigate('/register')}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Your School e-Market
            </Button>
          </div>
        </div>
      </section>

      {/* From Classroom to Community Section */}
      <section className="section-padding bg-gradient-to-r from-green-100 via-blue-50 to-amber-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] bg-repeat"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Every Experience Plants a Seed
          </h2>
          <p className="text-2xl md:text-3xl text-gray-700 mb-16 font-normal max-w-2xl mx-auto">
            Taste & Grow starts as a simple school market experience — and soon will grow into a world of challenges, digital seeds, and shared adventures.
          </p>
          <div className="mb-12 flex justify-center relative">
            <div className="relative inline-block">
              <img 
                src={seedGuardiansImg} 
                alt="Seed Guardians - Kids as food biodiversity heroes" 
                className="max-w-xs w-full rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full shadow-xl transform rotate-12 font-bold text-sm md:text-base">
                COMING SOON!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Taste & Grow</h3>
              <p className="text-gray-300 italic">Built for schools. Inspired by nature.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-wrap gap-4">
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
                <span className="text-gray-600">|</span>
                <a href="#food-kits" className="text-gray-300 hover:text-white transition-colors">Food Kits</a>
                <span className="text-gray-600">|</span>
                <button onClick={() => navigate('/register')} className="text-gray-300 hover:text-white transition-colors">Register</button>
                <span className="text-gray-600">|</span>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              Email: <a href="mailto:hello@tasteandgrow.com" className="text-green-400 hover:text-green-300 transition-colors">hello@tasteandgrow.com</a>
            </p>
            <p className="text-gray-500 text-sm mt-4">
              © 2025 Taste & Grow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

