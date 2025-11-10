'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

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
          notes: d.notes || ''
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
          ))}
        </div>
      </div>
    </div>
  );

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
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center pt-16">
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-16">
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
            </div>
          </div>

          {/* Content */}
          {activeTab === 'dashboard' ? <DashboardContent /> : <AboutContent />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrganizationDashboard;







