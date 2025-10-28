'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const DonorAboutPage = () => {
  const router = useRouter();
  const { user, userRole } = useAppContext();

  useEffect(() => {
    if (!user) {
      router.push('/connect?role=donor');
      return;
    }
    if (userRole && userRole !== 'donor') {
      router.push('/');
      return;
    }
  }, [user, userRole, router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="px-6 md:px-16 lg:px-32 py-20">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
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

            {/* How It Works for Donors */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">How It Works for Donors</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Discover</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Find verified nonprofits and women's shelters in your area that accept 
                    menstrual product donations.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">💝</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Commit</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create a donation commitment specifying what products you'll donate 
                    and coordinate directly with the organization.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Deliver</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Follow through on your commitment by delivering the products to the 
                    organization and making a real difference.
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

            {/* Donation Guidelines */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Donation Guidelines</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">What to Donate</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-gray-700">• Sanitary pads (all sizes)</p>
                      <p className="text-gray-700">• Tampons (with applicators)</p>
                      <p className="text-gray-700">• Pantyliners</p>
                      <p className="text-gray-700">• Menstrual cups</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700">• Period underwear</p>
                      <p className="text-gray-700">• Pain relief medication</p>
                      <p className="text-gray-700">• Heating pads</p>
                      <p className="text-gray-700">• Hygiene wipes</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Donation Tips</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">• Ensure products are unopened and within expiration date</p>
                    <p className="text-gray-700">• Include a variety of sizes and absorbencies</p>
                    <p className="text-gray-700">• Consider donating both regular and overnight products</p>
                    <p className="text-gray-700">• Include pain relief items when possible</p>
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
              <button 
                onClick={() => router.push('/donor/discover')}
                className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Start Donating
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonorAboutPage;










