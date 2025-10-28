'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="px-6 md:px-16 lg:px-32 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                About <span className="text-pink-600">Go with the Flow</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                We're on a mission to end period poverty by connecting compassionate donors 
                with organizations that serve women in need.
              </p>
            </div>

            {/* Mission Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                We believe that access to menstrual products is a fundamental right, not a privilege. 
                Period poverty affects millions of women and girls worldwide, forcing them to choose 
                between basic necessities and essential hygiene products.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Go with the Flow bridges the gap between generous donors and organizations serving 
                women's shelters, community health centers, and nonprofits. Together, we're creating 
                a world where no woman has to face period poverty alone.
              </p>
            </div>

            {/* How It Works */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">How It Works</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">★</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Find Organizations</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Discover verified nonprofits and women's shelters in your area that accept 
                    menstrual product donations.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">♥</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Make Donations</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Place orders for menstrual products that go directly to organizations 
                    serving women in need in your community.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">✔</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Track Impact</h3>
                  <p className="text-gray-600 leading-relaxed">
                    See how your donations make a real difference in your community and 
                    help end period poverty.
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Organizations */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Verified Organizations</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Organizations with a ✓ checkmark are verified partners who have completed our 
                rigorous registration process. This ensures that:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 text-xl">✓</span>
                    <p className="text-gray-700">They are legitimate nonprofit organizations</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 text-xl">✓</span>
                    <p className="text-gray-700">They serve underserved communities</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 text-xl">✓</span>
                    <p className="text-gray-700">They have proper documentation and tax status</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 text-xl">✓</span>
                    <p className="text-gray-700">They can receive direct product donations</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 text-xl">✓</span>
                    <p className="text-gray-700">They maintain proper donation records</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 text-xl">✓</span>
                    <p className="text-gray-700">They provide regular impact updates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Statistics */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Impact</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">500+</div>
                  <div className="text-gray-600">Organizations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">10K+</div>
                  <div className="text-gray-600">Products Donated</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">2K+</div>
                  <div className="text-gray-600">Active Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">50+</div>
                  <div className="text-gray-600">Cities</div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join our community of compassionate donors and help end period poverty in your area.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/user-dashboard'}
                  className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  Start Donating
                </button>
                <button 
                  onClick={() => window.location.href = '/organization-dashboard'}
                  className="bg-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-purple-800 transition-colors border border-white/30"
                >
                  Join as Organization
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;













