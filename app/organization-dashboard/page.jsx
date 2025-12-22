'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { DONATION_TYPES, DONATION_TYPE_CONFIG } from "@/config/donationTypes";
import toast from "react-hot-toast";

const OrganizationDashboard = () => {
  const router = useRouter();
  const { user, userRole, getToken } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [organizationData, setOrganizationData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    thisMonthOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingCategories, setEditingCategories] = useState(false);
  const [savingCategories, setSavingCategories] = useState(false);

  // Redirect if not authenticated or not an organization
  useEffect(() => {
    // Wait a bit for userRole to load before redirecting
    if (!user) {
      router.push('/connect?role=organization');
      return;
    }
    // Only redirect if userRole is explicitly set and not organization
    // This prevents premature redirects while userRole is still loading
    if (userRole !== null && userRole !== undefined && userRole !== 'organization') {
      router.push('/');
      return;
    }
  }, [user, userRole, router]);

  const loadData = async () => {
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };
      
      const [orgRes, donationsRes, statsRes] = await Promise.all([
        axios.get('/api/organizations/me', { headers }),
        axios.get('/api/donations/organization', { headers }),
        axios.get('/api/organizations/stats', { headers })
      ]);

      if (orgRes.data?.success) {
        setOrganizationData(orgRes.data.organization);
      }
      if (donationsRes.data?.success) {
        // Normalize donations to existing structure expected by UI
        const mapped = donationsRes.data.donations.map(d => ({
          id: d._id,
          donorName: d.donorName,
          items: d.items,
          totalItems: d.totalItems,
          date: new Date(d.date).toISOString().slice(0,10),
          status: d.status,
          notes: d.notes || '',
          image: d.image // Include Cloudinary image metadata
        }));
        setOrders(mapped);
      }
      if (statsRes.data?.success) {
        setStats(statsRes.data.stats);
      }
    } catch (e) {
      console.error('Error loading organization dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put('/api/donations/organization', 
        { donationId: orderId, status: newStatus }
      );
      if (response.data.success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        // Refresh stats after status update
        loadData();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDonationTypeToggle = (donationType) => {
    if (!organizationData) return;
    const currentTypes = organizationData.acceptedDonationTypes || [];
    const newTypes = currentTypes.includes(donationType)
      ? currentTypes.filter(type => type !== donationType)
      : [...currentTypes, donationType];
    
    setOrganizationData(prev => ({
      ...prev,
      acceptedDonationTypes: newTypes
    }));
  };

  const handleSaveCategories = async () => {
    if (!organizationData) return;
    
    // Require at least one category
    if (!organizationData.acceptedDonationTypes || organizationData.acceptedDonationTypes.length === 0) {
      toast.error('Please select at least one donation category');
      return;
    }

    setSavingCategories(true);
    try {
      const token = await getToken();
      const response = await axios.put('/api/organizations/me', 
        { acceptedDonationTypes: organizationData.acceptedDonationTypes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Donation categories updated successfully');
        setEditingCategories(false);
        loadData(); // Refresh to get updated data
      }
    } catch (error) {
      console.error('Error updating donation categories:', error);
      toast.error('Failed to update donation categories');
    } finally {
      setSavingCategories(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_transit': return 'In Transit';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const DashboardContent = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💝</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-3xl font-bold text-gray-900">{stats.thisMonthOrders.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-pink-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Donation Orders</h3>
        
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left side - Order Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                      <p className="text-gray-600">From: {order.donorName}</p>
                      <p className="text-sm text-gray-500">Date: {order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'in_transit')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
                        >
                          Mark In Transit
                        </button>
                      )}
                      {order.status === 'in_transit' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Items ({order.totalItems} total):</h5>
                    <div className="grid md:grid-cols-2 gap-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
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

                  {order.notes && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800"><strong>Notes:</strong> {order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Right side - Donation Image */}
                {order.image?.secure_url ? (
                  <div className="md:w-80 flex-shrink-0">
                    <h5 className="text-lg font-semibold text-gray-700 mb-3">Donation Photo:</h5>
                    <div 
                      className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border-2 border-pink-200 shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(order.image.secure_url)}
                    >
                      <Image
                        src={order.image.secure_url}
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
      </div>
    </div>
  );

  const SettingsContent = () => {
    const currentTypes = organizationData?.acceptedDonationTypes || [];
    
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-pink-100">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Organization Settings</h2>
        
        <div className="space-y-8">
          {/* Donation Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Accepted Donation Categories
                </h3>
                <p className="text-gray-600 text-sm">
                  Select the types of donations your organization accepts. This helps donors find your organization when searching for specific donation types.
                </p>
              </div>
              {!editingCategories && (
                <button
                  onClick={() => setEditingCategories(true)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {editingCategories ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.values(DONATION_TYPES).map((type) => {
                    const config = DONATION_TYPE_CONFIG[type];
                    const isSelected = currentTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleDonationTypeToggle(type)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 shadow-md'
                            : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{config.icon}</span>
                          <span className={`font-medium text-sm ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                            {config.label}
                          </span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-pink-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {currentTypes.length === 0 && (
                  <p className="text-sm text-red-600">
                    Please select at least one donation category
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveCategories}
                    disabled={savingCategories || currentTypes.length === 0}
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingCategories ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingCategories(false);
                      loadData(); // Reset to original data
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentTypes.length > 0 ? (
                  currentTypes.map((type) => {
                    const config = DONATION_TYPE_CONFIG[type];
                    return (
                      <div
                        key={type}
                        className="p-4 rounded-lg border-2 border-pink-200 bg-pink-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{config.icon}</span>
                          <span className="font-medium text-sm text-pink-700">
                            {config.label}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm md:col-span-3">
                    No donation categories selected. Click "Edit" to add categories.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const AboutContent = () => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-pink-100">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About GirlsWhoGive</h2>
      
      <div className="space-y-6 text-lg text-gray-700">
        <p>
          GirlsWhoGive is a platform dedicated to ending period poverty by connecting 
          compassionate donors with organizations that serve women in need. We believe that 
          access to menstrual products is a fundamental right, not a privilege.
        </p>
        
        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">For Organizations</h3>
        <p>
          As a verified organization, you play a crucial role in our mission. Your dashboard 
          helps you track incoming donations, coordinate with donors, and monitor your impact 
          on the community you serve.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dashboard Features</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">📊 Analytics</h4>
            <p className="text-gray-600">Track total orders, products received, and monthly statistics</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">📋 Order Management</h4>
            <p className="text-gray-600">View and manage incoming donation orders from verified donors</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">✅ Status Updates</h4>
            <p className="text-gray-600">Update order status and communicate with donors</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">💝 Impact Tracking</h4>
            <p className="text-gray-600">Monitor your organization's impact on the community</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Getting Started</h3>
        <p>
          Your organization has been verified and is now part of our network. Donors can 
          find you in their local search results and place orders directly through our platform. 
          Make sure to keep your profile information up to date and respond to donation orders promptly.
        </p>
      </div>
    </div>
  );

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
            <p className="text-gray-600">Loading your dashboard...</p>
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
        className="relative min-h-screen pt-16"
        style={{
          backgroundImage: 'url(/background/BackgroundUI.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }}
      >
        <div className="px-6 md:px-16 lg:px-32 py-8">
          {/* Header */}
          <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Organization Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                  Welcome, {organizationData?.name || 'Loading...'} 
                  {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FIX */}
              </p>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  ✓ Verified Organization
              </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-full p-2 shadow-lg border border-pink-100">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === 'dashboard'
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === 'about'
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === 'settings'
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'dashboard' ? <DashboardContent /> : 
           activeTab === 'settings' ? <SettingsContent /> : 
           <AboutContent />}
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

export default OrganizationDashboard;







