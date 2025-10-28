'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const MyDonationsPage = () => {
  const router = useRouter();
  const { user, userRole, donations, fetchDonations } = useAppContext();
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated or not a donor
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

  useEffect(() => {
    const loadDonations = async () => {
      if (user && userRole === 'donor') {
        await fetchDonations();
      }
    };

    loadDonations();
  }, [user, userRole, fetchDonations]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Removed loading state to prevent glitching

  return (
    <>
      <EnhancedNavbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-16">
        <div className="px-6 md:px-16 lg:px-32 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My Donation Commitments
            </h1>
            <p className="text-lg text-gray-600">
              Track your donation commitments and their status
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Commitments</p>
                  <p className="text-3xl font-bold text-gray-900">{donations.length}</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Items Donated</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {donations.reduce((total, donation) => total + donation.totalItems, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💝</span>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Organizations Helped</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {new Set(donations.map(d => d.organizationName)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
              </div>
            </div>
          </div>

          {/* Donations List */}
          {donations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No donation commitments yet</h3>
              <p className="text-gray-600 mb-6">
                Start making a difference by finding organizations near you and creating donation commitments.
              </p>
              <button
                onClick={() => router.push('/donor/discover')}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
              >
                Discover Organizations
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {donations.map((donation) => (
                <div key={donation._id || donation.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{donation.organizationName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                          {getStatusText(donation.status)}
                        </span>
                      </div>
                      <p className="text-gray-600">Committed on {formatDate(donation.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pink-600">{donation.totalItems}</p>
                      <p className="text-sm text-gray-500">total items</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Items Committed:</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {donation.items.map((item, index) => (
                        <div key={`${donation._id || donation.id}-${item.productType || item.name}-${index}`} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-pink-600 font-semibold">×{item.quantity}</span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status-specific information */}
                  {donation.status === 'pending' && (
                    <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Pending:</strong> Your donation commitment is awaiting confirmation from the organization. 
                        They will contact you to coordinate delivery.
                      </p>
                    </div>
                  )}

                  {donation.status === 'confirmed' && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Confirmed:</strong> The organization has confirmed your donation. 
                        Please coordinate delivery as discussed.
                      </p>
                    </div>
                  )}

                  {donation.status === 'delivered' && (
                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                      <p className="text-green-800 text-sm">
                        <strong>Delivered:</strong> Thank you for your generous donation! 
                        Your items have been successfully delivered to the organization.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    {donation.status === 'pending' && (
                      <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                        Contact Organization
                      </button>
                    )}
                    {donation.status !== 'delivered' && donation.status !== 'cancelled' && (
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors">
                        Cancel Commitment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-8 text-center text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Make Another Impact?</h2>
            <p className="text-pink-100 mb-6">
              Continue supporting your community by finding more organizations that need help.
            </p>
            <button
              onClick={() => router.push('/donor/discover')}
              className="bg-white text-pink-600 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Discover More Organizations
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyDonationsPage;




