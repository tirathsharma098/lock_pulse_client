import Link from "next/link";
import { Shield, Users, ChevronDown } from "lucide-react";

export default function HomeHeader({
  setShowDevFeatures,
  showDevFeatures,
}: {
  setShowDevFeatures: (show: boolean) => void;
  showDevFeatures: boolean;
}) {
  return (
    <nav className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-white">LockPulse</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowDevFeatures(!showDevFeatures)}
            className="text-sm text-gray-300 hover:text-primary transition-colors duration-300 flex items-center space-x-1"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">For Developers & Teams</span>
            <span className="sm:hidden">For Teams</span>
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
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300 hidden md:block"
          >
            Create Account
          </Link>
        </div>
      </div>
    </nav>
  );
}
