"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";
import Logo from "./Logo";

const Navbar = () => {
  const { user, userRole } = useAppContext();
  const { openSignIn } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) {
      return [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/connect", label: "Connect" }
      ];
    }

    switch (userRole) {
      case 'donor':
        return [
          { href: "/", label: "Home" },
          { href: "/donor/discover", label: "Discover" },
          { href: "/donor/donations", label: "My Donations" },
          { href: "/about", label: "About" }
        ];
              case 'organization':
                return [
                  { href: "/", label: "Home" },
                  { href: "/organization-dashboard", label: "Dashboard" },
                  { href: "/about", label: "About" }
                ];
              case 'admin':
                return [
                  { href: "/", label: "Home" },
                  { href: "/admin/dashboard", label: "Admin Dashboard" },
                  { href: "/admin/organizations", label: "Organizations" },
                  { href: "/admin/donations", label: "All Donations" },
                  { href: "/about", label: "About" }
                ];
      default:
        return [
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/connect", label: "Connect" }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-lg border-b border-pink-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
                  {/* Logo */}
                  <Link href="/" className="flex items-center space-x-3">
                    <Logo size="default" />
                    <span className="text-2xl font-bold text-gray-900">
                      Go with the <span className="text-pink-600">Flow</span>
                    </span>
                  </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Role Badge */}
                <span className="hidden sm:inline-block bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {userRole === 'donor' ? 'Donor' : userRole === 'organization' ? 'Organization' : 'Admin'}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors duration-200"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-pink-100">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2">
                    <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {userRole === 'donor' ? 'Donor' : userRole === 'organization' ? 'Organization' : 'Admin'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;