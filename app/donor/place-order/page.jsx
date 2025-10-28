'use client'
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const PlaceOrderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userRole, createDonation } = useAppContext();
  const orgId = searchParams.get('orgId');
  
  const [organization, setOrganization] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch organization data from API
  const fetchOrganization = async (orgId) => {
    try {
      const response = await fetch(`/api/organizations/${orgId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.organization;
        }
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
    }
    return null;
  };

  const productTypes = [
    { id: 'pads', name: 'Sanitary Pads', description: 'Regular and overnight pads in various sizes' },
    { id: 'tampons', name: 'Tampons', description: 'Regular and super tampons with applicators' },
    { id: 'menstrual_cups', name: 'Menstrual Cups', description: 'Reusable silicone menstrual cups' },
    { id: 'liners', name: 'Pantyliners', description: 'Daily liners and pantyliners' },
    { id: 'period_underwear', name: 'Period Underwear', description: 'Absorbent underwear for light to moderate flow' },
    { id: 'pain_relief', name: 'Pain Relief', description: 'Ibuprofen, heating pads, and other comfort items' }
  ];

  useEffect(() => {
    // Redirect if not authenticated or not a donor
    if (!user) {
      router.push('/connect?role=donor');
      return;
    }
    if (userRole && userRole !== 'donor') {
      router.push('/');
      return;
    }

    const loadOrganization = async () => {
      if (orgId) {
        const org = await fetchOrganization(orgId);
        if (org) {
          setOrganization(org);
        } else {
          router.push('/donor/discover');
        }
      } else {
        router.push('/donor/discover');
      }
      setLoading(false);
    };

    loadOrganization();
  }, [orgId, router, user, userRole]);

  const addItem = (productType) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.productType === productType.id);
      if (existingItem) {
        return prev.map(item =>
          item.productType === productType.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { 
          productType: productType.id, 
          name: productType.name, 
          quantity: 1, 
          description: '' 
        }];
      }
    });
  };

  const updateQuantity = (productType, quantity) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.productType !== productType));
    } else {
      setOrderItems(prev =>
        prev.map(item =>
          item.productType === productType
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const updateDescription = (productType, description) => {
    setOrderItems(prev =>
      prev.map(item =>
        item.productType === productType
          ? { ...item, description }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      alert('Please add at least one item to your donation commitment.');
      return;
    }

    setSubmitting(true);
    try {
      const donationData = {
        organizationId: organization.id || organization._id,
        organizationName: organization.name,
        items: orderItems,
        totalItems: getTotalItems(),
        status: 'pending',
        donorName: user.firstName + ' ' + user.lastName,
        donorEmail: user.emailAddresses[0].emailAddress
      };

      const result = await createDonation(donationData);
      if (result) {
        router.push('/donor/donations');
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      alert('Error creating donation commitment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <EnhancedNavbar />
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading organization details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <EnhancedNavbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-16">
        <div className="px-6 md:px-16 lg:px-32 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Create Donation Commitment
            </h1>
            <p className="text-lg text-gray-600">
              Commit to donating menstrual products to {organization.name}
            </p>
          </div>

          {/* Organization Info */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-pink-100 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{organization.name}</h2>
              <p className="text-gray-600 mb-4">📍 {organization.address}</p>
              <p className="text-gray-700 leading-relaxed">{organization.description}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="text-gray-900">{organization.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-gray-900">{organization.email}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Products to Donate</h3>
              
              <div className="space-y-4">
                {productTypes.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-2xl p-4 hover:border-pink-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                      <button
                        onClick={() => addItem(product)}
                        className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Donation Commitment</h3>
              
              {orderItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛍️</div>
                  <p className="text-gray-600">No items added yet</p>
                  <p className="text-sm text-gray-500">Select products from the left to start your donation commitment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.productType} className="border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.productType, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productType, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <textarea
                        placeholder="Add any specific details (brand preferences, sizes, etc.)"
                        value={item.description}
                        onChange={(e) => updateDescription(item.productType, e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
                        rows="2"
                      />
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total Items:</span>
                      <span className="text-xl font-bold text-pink-600">{getTotalItems()}</span>
                    </div>
                    
                    <button
                      onClick={handleSubmitOrder}
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {submitting ? 'Creating Commitment...' : 'Create Donation Commitment'}
                    </button>
                    
                    <p className="text-sm text-gray-500 text-center mt-3">
                      This creates a donation commitment. You'll coordinate delivery directly with {organization.name}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors underline"
            >
              ← Back to Organizations
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const PlaceOrderPage = () => {
  return (
    <Suspense fallback={
      <>
        <EnhancedNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    }>
      <PlaceOrderContent />
    </Suspense>
  );
};

export default PlaceOrderPage;






