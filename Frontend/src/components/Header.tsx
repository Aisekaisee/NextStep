import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">N</span>
          </div>
          <span className="text-xl font-bold text-foreground">NextStep</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button
            variant={location.pathname === '/' ? 'default' : 'ghost'}
            onClick={() => navigate('/')}
            size="sm"
          >
            Home
          </Button>
          <Button
            variant={location.pathname === '/resume' ? 'default' : 'ghost'}
            onClick={() => navigate('/resume')}
            size="sm"
          >
            Upload Resume
          </Button>
          <Button
            variant={location.pathname === '/manual' ? 'default' : 'ghost'}
            onClick={() => navigate('/manual')}
            size="sm"
          >
            Find Career
          </Button>
        </nav>

        {/* Back button for mobile */}
        {location.pathname !== '/' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;