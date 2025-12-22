'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

const AdminDonations = () => {
  const router = useRouter();
  const { user, userRole, getToken } = useAppContext();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/connect');
      return;
    }
    if (userRole && userRole !== 'admin') {
      router.push(`/${userRole}/dashboard`); // Redirect if not an admin
      return;
    }

    const fetchDonations = async () => {
      try {
        const token = await getToken();
        const response = await axios.get('/api/admin/donations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setDonations(response.data.donations);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
        toast.error("Failed to load donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user, userRole, router, getToken]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <>
        <EnhancedNavbar />
        <div 
          className="relative min-h-screen flex items-center justify-center pt-16"
          style={{
            backgroundImage: 'url(/background/BackgroundUI.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            minHeight: '100vh'
          }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading donations...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <EnhancedNavbar />
      <div 
        className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-16"
        style={{
          backgroundImage: 'url(/background/BackgroundUI.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">All Donations</h1>
            <p className="text-xl text-gray-600">Platform-wide donation tracking</p>
          </div>

          {donations.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-pink-100 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations found</h3>
              <p className="text-gray-600">Donations will appear here once donors place orders.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {donations.map((donation) => (
                <div key={donation._id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side - Donation Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {donation.donorId?.firstName} {donation.donorId?.lastName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                          {donation.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        📍 {donation.organizationId?.name || 'Unknown Organization'}
                      </p>
                      <p className="text-gray-600 mb-4">
                        📧 {donation.donorId?.email || 'No email'}
                      </p>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date</p>
                          <p className="text-gray-900">{new Date(donation.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Total Items</p>
                          <p className="text-gray-900">{donation.totalItems}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Organization</p>
                          <p className="text-gray-900">{donation.organizationId?.name || 'Unknown'}</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Items Donated:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {donation.items.map((item, index) => (
                            <li key={index} className="text-gray-600">
                              {item.quantity} x {item.name || item.productName} 
                              {item.description && ` (${item.description})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right side - Donation Image */}
                    {donation.image?.secure_url ? (
                      <div className="md:w-80 flex-shrink-0">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">Donation Photo:</h4>
                        <div 
                          className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border-2 border-pink-200 shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage(donation.image.secure_url)}
                        >
                          <Image
                            src={donation.image.secure_url}
                            alt="Donation photo"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">Click to view full size</p>
                      </div>
                    ) : (
                      <div className="md:w-80 flex-shrink-0 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="text-4xl mb-2">📷</div>
                          <p className="text-sm">No image uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-pink-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-pink-700 transition-colors duration-200 shadow-md"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-gray-200 z-10"
            >
              ×
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Donation photo full size"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AdminDonations;



