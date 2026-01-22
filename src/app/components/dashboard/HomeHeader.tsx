import Link from "next/link";
import { Shield, Users, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

export default function HomeHeader({
  setShowDevFeatures,
  showDevFeatures,
}: {
  setShowDevFeatures: (show: boolean) => void;
  showDevFeatures: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-white">LockPulse</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setShowDevFeatures(!showDevFeatures)}
            className="text-sm text-gray-300 hover:text-primary transition-colors duration-300 flex items-center space-x-1"
          >
            <Users className="h-4 w-4" />
            <span>For Teams</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                showDevFeatures ? "rotate-180" : ""
              }`}
            />
          </button>
          <Link
            href="/login"
            className="bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300"
          >
            Create Account
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-3 pb-4">
          <button
            onClick={() => {
              setShowDevFeatures(!showDevFeatures);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left text-sm text-gray-300 hover:text-primary transition-colors duration-300 flex items-center space-x-2 py-2"
          >
            <Users className="h-4 w-4" />
            <span>For Teams</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                showDevFeatures ? "rotate-180" : ""
              }`}
            />
          </button>
          <Link
            href="/login"
            className="block w-full text-center bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="block w-full text-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Create Account
          </Link>
        </div>
      )}
    </nav>
  );
}
