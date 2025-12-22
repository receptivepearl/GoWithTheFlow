'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AdminOrganizations = () => {
  const router = useRouter();
  const { user, userRole, getToken } = useAppContext();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/connect');
      return;
    }
    if (userRole && userRole !== 'admin') {
      router.push(`/${userRole}/dashboard`); // Redirect if not an admin
      return;
    }

    const fetchOrganizations = async () => {
      try {
        const token = await getToken();
        const response = await axios.get('/api/admin/organizations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setOrganizations(response.data.organizations);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        toast.error("Failed to load organizations.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [user, userRole, router, getToken]);

  const handleVerifyToggle = async (orgId, currentStatus) => {
    try {
      const token = await getToken();
      const response = await axios.put('/api/admin/organizations', 
        { organizationId: orgId, verified: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Organization ${!currentStatus ? 'verified' : 'unverified'} successfully`);
        // Update local state
        setOrganizations(prev => 
          prev.map(org => 
            org._id === orgId ? { ...org, verified: !currentStatus } : org
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Failed to update organization status.");
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
            <p className="text-xl text-gray-600">Loading organizations...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Organization Management</h1>
            <p className="text-xl text-gray-600">Review and verify organizations</p>
          </div>

          {organizations.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-pink-100 text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No organizations found</h3>
              <p className="text-gray-600">Organizations will appear here once they register.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {organizations.map((org) => (
                <div key={org._id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{org.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          org.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {org.verified ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">📍 {org.address}</p>
                      {org.description && (
                        <p className="text-gray-700 mb-4">{org.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Registration Date</p>
                      <p className="text-gray-900">{new Date(org.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                      <p className="text-gray-900">{org.totalOrders || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Products Received</p>
                      <p className="text-gray-900">{org.totalProducts || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {org.verified ? (
                        <span className="text-green-600 font-medium">✓ This organization can receive donations</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">⏳ Awaiting verification to receive donations</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleVerifyToggle(org._id, org.verified)}
                      className={`px-6 py-2 rounded-full font-medium transition-colors ${
                        org.verified
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {org.verified ? 'Unverify' : 'Verify'}
                    </button>
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
      <Footer />
    </>
  );
};

export default AdminOrganizations;



